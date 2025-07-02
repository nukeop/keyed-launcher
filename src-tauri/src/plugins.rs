use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn ensure_plugin_directories(app: AppHandle) -> Result<Vec<String>, String> {
    let config_path = get_plugin_base_path(app)?;

    let directories = vec![
        config_path.join("bundled"),
        config_path.join("user"),
        config_path.join("development"),
    ];

    let mut created_paths = Vec::new();

    for dir in directories {
        if let Err(e) = fs::create_dir_all(&dir) {
            return Err(format!("Failed to create directory {:?}: {}", dir, e));
        }
        created_paths.push(dir.to_string_lossy().to_string());
    }

    Ok(created_paths)
}

#[tauri::command]
pub fn get_plugin_directories(app: AppHandle) -> Result<Vec<String>, String> {
    let config_path = get_plugin_base_path(app)?;

    let directories = vec![
        config_path.join("bundled"),
        config_path.join("user"),
        config_path.join("development"),
    ];

    let mut paths = Vec::new();
    for dir in directories {
        paths.push(dir.to_string_lossy().to_string());
    }

    Ok(paths)
}

fn get_plugin_base_path(app: AppHandle) -> Result<PathBuf, String> {
    let plugins_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {e}"))?
        .join("plugins");

    Ok(plugins_dir)
}
