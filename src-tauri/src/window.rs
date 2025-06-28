use std::time::Instant;
use tauri::{Runtime, WebviewWindow};

#[tauri::command]
pub async fn hide_window<R: Runtime>(window: WebviewWindow<R>) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn show_window<R: Runtime>(window: WebviewWindow<R>) -> Result<(), String> {
    crate::shortcuts::show_window_centered(&window).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn toggle_window<R: Runtime>(window: WebviewWindow<R>) -> Result<(), String> {
    crate::shortcuts::toggle_window_visibility(&window).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn performance_test<R: Runtime>(window: WebviewWindow<R>) -> Result<String, String> {
    let mut results = Vec::new();

    for i in 0..10 {
        let start = Instant::now();
        window.hide().map_err(|e| e.to_string())?;
        let hide_time = start.elapsed();

        let start = Instant::now();
        crate::shortcuts::show_window_centered(&window).map_err(|e| e.to_string())?;
        let show_time = start.elapsed();

        results.push(format!(
            "Test {}: Hide: {:.2}ms, Show: {:.2}ms",
            i + 1,
            hide_time.as_millis(),
            show_time.as_millis()
        ));

        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    }

    Ok(results.join("\n"))
}
