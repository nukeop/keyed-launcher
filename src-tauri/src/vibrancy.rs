use log::info;

#[cfg(any(target_os = "macos", target_os = "windows"))]
use log::error;
use tauri::{App, Manager, WebviewWindow};

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[cfg(target_os = "windows")]
use window_vibrancy::apply_acrylic;

pub fn setup_window_vibrancy(app: &mut App) -> tauri::Result<()> {
    let window = app
        .get_webview_window("main")
        .expect("Main window not found");

    apply_vibrancy_effect(&window)?;

    Ok(())
}

fn apply_vibrancy_effect(
    #[cfg_attr(target_os = "linux", allow(unused_variables))] window: &WebviewWindow,
) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    {
        info!("Applying vibrancy effect for macOS");
        if let Err(e) = apply_vibrancy(window, NSVisualEffectMaterial::HudWindow, None, None) {
            error!("Failed to apply vibrancy on macOS: {}", e);
        } else {
            info!("Successfully applied vibrancy effect on macOS");
        }
    }

    #[cfg(target_os = "windows")]
    {
        info!("Applying acrylic effect for Windows");
        if let Err(e) = apply_acrylic(window, Some((18, 18, 18, 200))) {
            error!("Failed to apply acrylic on Windows: {}", e);
        } else {
            info!("Successfully applied acrylic effect on Windows");
        }
    }

    #[cfg(target_os = "linux")]
    {
        info!("Vibrancy effects are not supported on Linux - using normal window rendering");
    }

    Ok(())
}

#[allow(dead_code)]
pub fn clear_vibrancy_effect(
    #[cfg_attr(target_os = "linux", allow(unused_variables))] window: &WebviewWindow,
) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    {
        use window_vibrancy::clear_vibrancy;
        if let Err(e) = clear_vibrancy(window) {
            error!("Failed to clear vibrancy on macOS: {}", e);
        }
    }

    #[cfg(target_os = "windows")]
    {
        use window_vibrancy::clear_acrylic;
        if let Err(e) = clear_acrylic(window) {
            error!("Failed to clear acrylic on Windows: {}", e);
        }
    }

    #[cfg(target_os = "linux")]
    {
        info!("Clear vibrancy called on Linux (no-op)");
    }

    Ok(())
}
