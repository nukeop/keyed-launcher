use tauri::WebviewWindow;

#[tauri::command]
pub async fn hide_window(window: WebviewWindow) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn show_window(window: WebviewWindow) -> Result<(), String> {
    crate::shortcuts::show_window_centered(&window).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn toggle_window(window: WebviewWindow) -> Result<(), String> {
    crate::shortcuts::toggle_window_visibility(&window).map_err(|e| e.to_string())?;
    Ok(())
}
