use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde_json;
use std::fs;
use std::sync::mpsc;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};

#[tauri::command]
pub async fn start_theme_watcher(app: AppHandle) -> Result<(), String> {
    let themes_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?
        .join("themes");

    if !themes_dir.exists() {
        std::fs::create_dir_all(&themes_dir)
            .map_err(|e| format!("Failed to create themes directory: {}", e))?;
    }

    tokio::spawn(async move {
        if let Err(e) = watch_theme_files(app, &themes_dir).await {
            eprintln!("Theme watcher error: {}", e);
        }
    });

    Ok(())
}

async fn watch_theme_files(app: AppHandle, themes_dir: &std::path::Path) -> Result<(), String> {
    let (tx, rx) = mpsc::channel();

    let mut watcher = RecommendedWatcher::new(
        move |res: Result<Event, notify::Error>| match res {
            Ok(event) => {
                let _ = tx.send(event);
            }
            Err(e) => {
                eprintln!("File watcher: Error received: {:?}", e);
            }
        },
        Config::default(),
    )
    .map_err(|e| format!("Failed to create watcher: {}", e))?;

    if themes_dir.exists() {
        watcher
            .watch(themes_dir, RecursiveMode::NonRecursive)
            .map_err(|e| format!("Failed to watch directory {:?}: {}", themes_dir, e))?;
    }

    thread::spawn(move || {
        let _watcher = watcher;
        while let Ok(event) = rx.recv() {
            if should_reload_theme(&event) {
                thread::sleep(Duration::from_millis(100));

                if let Err(e) = app.emit("theme-file-changed", ()) {
                    eprintln!("Failed to emit theme-file-changed event: {}", e);
                }
            }
        }
    });

    Ok(())
}

fn should_reload_theme(event: &Event) -> bool {
    match &event.kind {
        EventKind::Create(_) | EventKind::Modify(_) => event.paths.iter().any(|path| {
            path.extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| ext.eq_ignore_ascii_case("json"))
                .unwrap_or(false)
        }),
        _ => false,
    }
}

#[tauri::command]
pub async fn load_user_themes(app: AppHandle) -> Result<Vec<serde_json::Value>, String> {
    let themes_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?
        .join("themes");

    if !themes_dir.exists() {
        std::fs::create_dir_all(&themes_dir)
            .map_err(|e| format!("Failed to create themes directory: {}", e))?;
        return Ok(vec![]);
    }

    let mut themes = Vec::new();

    let entries =
        fs::read_dir(&themes_dir).map_err(|e| format!("Failed to read themes directory: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        if path.extension().and_then(|ext| ext.to_str()) == Some("json") {
            match fs::read_to_string(&path) {
                Ok(content) => match serde_json::from_str::<serde_json::Value>(&content) {
                    Ok(theme) => {
                        themes.push(theme);
                    }
                    Err(e) => eprintln!("Failed to parse theme file {:?}: {}", path, e),
                },
                Err(e) => eprintln!("Failed to read theme file {:?}: {}", path, e),
            }
        }
    }

    Ok(themes)
}
