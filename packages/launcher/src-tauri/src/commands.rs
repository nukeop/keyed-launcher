use std::process::Command;
use tauri::command;

#[derive(Debug, serde::Serialize)]
pub struct CommandOutput {
    pub success: bool,
    pub code: Option<i32>,
    pub stdout: String,
    pub stderr: String,
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
