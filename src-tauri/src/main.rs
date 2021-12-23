#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  let wry = tauri::Builder::default();
  wry
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}
