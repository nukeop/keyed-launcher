mod shortcuts;
mod tray;
mod vibrancy;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, _event| {
                    shortcuts::handle_global_shortcut(app);
                })
                .build(),
        )
        .setup(|app| {
            if let Err(e) = shortcuts::setup_global_shortcuts(app) {
                eprintln!("Failed to setup global shortcuts: {e}");
            }

            if let Err(e) = tray::setup_system_tray(app) {
                eprintln!("Failed to setup system tray: {e}");
            }

            if let Err(e) = vibrancy::setup_window_vibrancy(app) {
                eprintln!("Failed to setup window vibrancy: {e}");
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            window::hide_window,
            window::show_window,
            window::toggle_window,
            #[cfg(debug_assertions)]
            window::performance_test,
            #[cfg(debug_assertions)]
            window::get_memory_usage
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
