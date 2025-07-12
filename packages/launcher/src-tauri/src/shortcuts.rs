use std::time::Instant;
use tauri::{AppHandle, Manager, Runtime, WebviewWindow};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

pub fn handle_global_shortcut<R: Runtime>(app: &AppHandle<R>) {
    #[cfg(debug_assertions)]
    let start_time = Instant::now();

    if let Some(window) = app.get_webview_window("main") {
        if let Err(e) = show_window_centered(&window) {
            eprintln!("Failed to show window on shortcut: {e}");
        } else {
            #[cfg(debug_assertions)]
            {
                let duration = start_time.elapsed();
                println!(
                    "Global shortcut activation time: {:.2}ms",
                    duration.as_millis()
                );
            }
        }
    }
}

pub fn setup_global_shortcuts(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let shortcut = "CmdOrCtrl+Shift+Space".parse::<Shortcut>()?;

    app.global_shortcut().register(shortcut)?;
    Ok(())
}

pub fn toggle_window_visibility<R: Runtime>(
    window: &WebviewWindow<R>,
) -> Result<(), Box<dyn std::error::Error>> {
    if window.is_visible()? {
        window.hide()?;
    } else {
        show_window_centered(window)?;
    }
    Ok(())
}

pub fn show_window_centered<R: Runtime>(
    window: &WebviewWindow<R>,
) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(debug_assertions)]
    let start_time = Instant::now();

    if let Some(monitor) = window.current_monitor()? {
        let monitor_size = monitor.size();
        let window_size = window.outer_size()?;

        let x = (monitor_size.width as i32 - window_size.width as i32) / 2;
        let y = (monitor_size.height as i32 - window_size.height as i32) / 3;

        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y }))?;
    }

    window.show()?;
    window.set_focus()?;

    #[cfg(debug_assertions)]
    {
        let duration = start_time.elapsed();
        println!("Window show operation time: {:.2}ms", duration.as_millis());
    }

    Ok(())
}
