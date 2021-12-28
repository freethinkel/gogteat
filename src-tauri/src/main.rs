#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod patch_window;

use tauri::Manager;
use tauri_plugin_vibrancy::{Vibrancy, MacOSVibrancy};
use tauri_plugin_sql::TauriSql;

#[cfg(target_os = "macos")]
use crate::patch_window::Toolbar;


fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      #[cfg(target_os = "windows")]
      window.apply_blur();

      #[cfg(target_os = "macos")]
      {
        window.apply_toolbar();
        window.apply_vibrancy(MacOSVibrancy::AppearanceBased);
      }

      Ok(())
    })
    .plugin(TauriSql::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
