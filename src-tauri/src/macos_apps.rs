use base64::{engine::general_purpose, Engine as _};
use icns::IconFamily;
use plist::Value;
use rayon::prelude::*;
use serde::Serialize;
use std::collections::HashSet;
use std::fs::{self, File};
use std::io::Cursor;
use std::path::{Path, PathBuf};

#[derive(Serialize, Debug, Clone, Eq, PartialEq, Hash)]
pub struct MacOSApp {
    name: String,
    path: String,
    bundle_id: String,
    icon: String, // Base64 encoded PNG
}

#[tauri::command]
pub fn get_macos_applications() -> Result<Vec<MacOSApp>, String> {
    let mut app_paths = Vec::new();

    // System applications
    app_paths.push(PathBuf::from("/Applications"));

    // User applications
    // Using `dirs` crate might be better but for now, this is fine.
    if let Ok(home) = std::env::var("HOME") {
        app_paths.push(PathBuf::from(home).join("Applications"));
    }

    let all_apps: HashSet<MacOSApp> = app_paths
        .into_par_iter()
        .filter_map(|path| scan_directory(&path).ok())
        .flatten()
        .collect();

    let mut sorted_apps: Vec<MacOSApp> = all_apps.into_iter().collect();
    sorted_apps.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

    Ok(sorted_apps)
}

fn scan_directory(dir: &Path) -> Result<Vec<MacOSApp>, std::io::Error> {
    if !dir.is_dir() {
        return Ok(vec![]);
    }

    let entries: Vec<_> = fs::read_dir(dir)?.filter_map(Result::ok).collect();

    let apps: Vec<MacOSApp> = entries
        .into_par_iter()
        .filter(|entry| entry.path().extension().is_some_and(|ext| ext == "app"))
        .filter_map(|entry| parse_app_bundle(&entry.path()))
        .collect();

    Ok(apps)
}

fn parse_app_bundle(app_path: &Path) -> Option<MacOSApp> {
    let info_plist_path = app_path.join("Contents/Info.plist");
    if !info_plist_path.exists() {
        return None;
    }

    let plist_file = File::open(&info_plist_path).ok()?;
    let plist_val = Value::from_reader(plist_file).ok()?;
    let plist_dict = plist_val.as_dictionary()?;

    let name = plist_dict
        .get("CFBundleName")
        .and_then(|v| v.as_string())
        .map(String::from)?;

    let bundle_id = plist_dict
        .get("CFBundleIdentifier")
        .and_then(|v| v.as_string())
        .map(String::from)?;

    let icon_file_name = plist_dict
        .get("CFBundleIconFile")
        .and_then(|v| v.as_string())
        .map(String::from)?;

    let icon_path = app_path
        .join("Contents/Resources")
        .join(
            icon_file_name
                .strip_suffix(".icns")
                .unwrap_or(&icon_file_name),
        )
        .with_extension("icns");

    let icon = extract_and_encode_icon(&icon_path).unwrap_or_default();

    Some(MacOSApp {
        name,
        path: app_path.to_string_lossy().into_owned(),
        bundle_id,
        icon,
    })
}

fn extract_and_encode_icon(icon_path: &Path) -> Option<String> {
    let file = File::open(icon_path).ok()?;
    let icon_family = IconFamily::read(file).ok()?;

    let &best_type = match icon_family
        .available_icons()
        .iter()
        .max_by_key(|icon_type| icon_type.pixel_width() * icon_type.pixel_height())
    {
        Some(icon_type) => icon_type,
        None => {
            eprintln!("ICNS file contains no icons");
            return None;
        }
    };

    let icon_image = match icon_family.get_icon_with_type(best_type) {
        Ok(image) => image,
        Err(e) => {
            eprintln!("Failed to get icon with type {:?}: {}", best_type, e);
            return None;
        }
    };

    let mut buffer = Cursor::new(Vec::new());
    if let Err(e) = icon_image.write_png(&mut buffer) {
        eprintln!("Failed to write PNG file: {}", e);
        return None;
    }

    let base64_icon = general_purpose::STANDARD.encode(buffer.get_ref());
    Some(format!("data:image/png;base64,{}", base64_icon))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[ignore] // This is an integration test that hits the real filesystem.
    fn test_real_app_scan_and_print() {
        let result = get_macos_applications();
        assert!(result.is_ok(), "get_macos_applications should not fail");

        let apps = result.unwrap();
        println!("\n--- macOS App Scan Results ---");
        println!("Found {} applications.", apps.len());

        for app in apps.iter() {
            println!(
                "- {}\n  Bundle ID: {}\n  Path: {}\n  Icon size: {} bytes",
                app.name,
                app.bundle_id,
                app.path,
                app.icon.len()
            );
        }

        assert!(
            !apps.is_empty(),
            "Expected to find at least one application on a macOS system."
        );
    }
}
