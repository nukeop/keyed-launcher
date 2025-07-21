use std::process::Command;
use sysinfo::System;
use tauri::command;

#[derive(Debug, serde::Serialize)]
pub struct CommandOutput {
    pub success: bool,
    pub code: Option<i32>,
    pub stdout: String,
    pub stderr: String,
}

#[derive(Debug, serde::Serialize)]
pub struct OSInfo {
    pub name: String,
    pub version: String,
    pub platform: String,
}

#[command]
pub async fn execute_command(program: String, args: Vec<String>) -> Result<CommandOutput, String> {
    let output = Command::new(&program)
        .args(&args)
        .output()
        .map_err(|e| format!("Failed to execute command '{program}': {e}"))?;

    let result = CommandOutput {
        success: output.status.success(),
        code: output.status.code(),
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
    };

    Ok(result)
}

#[command]
pub async fn execute_command_simple(program: String, args: Vec<String>) -> Result<(), String> {
    let output = Command::new(&program)
        .args(&args)
        .output()
        .map_err(|e| format!("Failed to execute command '{program}': {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "Command '{}' failed with exit code {:?}: {}",
            program,
            output.status.code(),
            stderr
        ));
    }

    Ok(())
}

#[command]
pub async fn get_os_info() -> Result<OSInfo, String> {
    let name = System::name().unwrap_or_else(|| "Unknown".to_string());
    let version = System::os_version().unwrap_or_else(|| "Unknown".to_string());

    let platform = if cfg!(target_os = "macos") {
        "macOS".to_string()
    } else if cfg!(target_os = "windows") {
        "windows".to_string()
    } else if cfg!(target_os = "linux") {
        "linux".to_string()
    } else {
        "unknown".to_string()
    };

    Ok(OSInfo {
        name,
        version,
        platform,
    })
}
