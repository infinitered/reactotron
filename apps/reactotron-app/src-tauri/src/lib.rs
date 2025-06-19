#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod reactotron_core_server;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// #[tauri::command]
// fn send_command(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
fn start_core_server(app: tauri::AppHandle) {
    reactotron_core_server::start_server(app);
}

#[tauri::command]
fn stop_core_server(app: tauri::AppHandle) {
    reactotron_core_server::stop_server(app);
}

#[tauri::command]
async fn send_command(
    app: tauri::AppHandle, 
    r#type: String, 
    payload: serde_json::Value, 
    client_id: String
) {
    let command = reactotron_core_server::CommandWithClientId {
        r#type,
        payload,
        client_id,
        important: false,
        date: Some(chrono::Utc::now().to_rfc3339()),
        delta_time: Some(0),
    };
    println!("send_command: {:?}", command);
    reactotron_core_server::send_command(app, command).await;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![
            start_core_server,
            stop_core_server,
            send_command,
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
