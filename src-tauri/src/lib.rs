// Modules
pub mod commands;
pub mod db;
pub mod errors;
pub mod models;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize database on startup
    if let Err(e) = db::init_database() {
        eprintln!("Failed to initialize database: {}", e);
        std::process::exit(1);
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Set fullscreen on startup for both Windows and macOS
            if let Some(window) = app.get_webview_window("main") {
                #[cfg(target_os = "macos")]
                {
                    // macOS: Use native fullscreen mode
                    let _ = window.set_fullscreen(true);
                }
                
                #[cfg(target_os = "windows")]
                {
                    // Windows: Set fullscreen
                    let _ = window.set_fullscreen(true);
                }
                
                #[cfg(target_os = "linux")]
                {
                    // Linux: Set fullscreen
                    let _ = window.set_fullscreen(true);
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Category commands
            commands::get_all_categories,
            commands::get_category_by_id,
            commands::create_category,
            commands::update_category,
            commands::delete_category,
            commands::validate_category,
            // Word commands
            commands::get_words_by_category,
            commands::add_word,
            commands::update_word,
            commands::delete_word,
            commands::get_random_words,
            commands::validate_category_for_mode,
            // Settings commands
            commands::get_settings,
            commands::update_setting,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
