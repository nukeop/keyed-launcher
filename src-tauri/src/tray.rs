use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    App, AppHandle, Manager, Runtime,
};

pub fn setup_system_tray<R: Runtime>(app: &App<R>) -> Result<(), Box<dyn std::error::Error>> {
    let show_hide_item = MenuItem::with_id(app, "show_hide", "Show/Hide", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&show_hide_item, &quit_item])?;

    let mut tray_builder = TrayIconBuilder::with_id("main")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| {
            handle_tray_menu_event(app, event.id.as_ref());
        });

    if let Some(icon) = app.default_window_icon() {
        tray_builder = tray_builder.icon(icon.clone());
    }

    let _tray = tray_builder.build(app)?;

    Ok(())
}

fn handle_tray_menu_event<R: Runtime>(app: &AppHandle<R>, menu_id: &str) {
    match menu_id {
        "show_hide" => {
            if let Some(window) = app.get_webview_window("main") {
                if let Err(e) = crate::shortcuts::toggle_window_visibility(&window) {
                    eprintln!("Failed to toggle window from tray: {e}");
                }
            }
        }
        "quit" => {
            std::process::exit(0);
        }
        _ => {}
    }
}
