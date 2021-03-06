use tauri::{Menu, MenuItem, Submenu, CustomMenuItem};

pub trait AddDefaultSubmenus {
  fn add_default_app_submenu_if_macos(self, app_name: &str) -> Self;
  fn add_default_file_submenu(self) -> Self;
  fn add_default_edit_submenu(self) -> Self;
  fn add_default_view_submenu(self) -> Self;
  fn add_default_window_submenu(self) -> Self;
}

impl AddDefaultSubmenus for Menu {
  fn add_default_app_submenu_if_macos(self, app_name: &str) -> Menu {
    #[cfg(target_os = "macos")]
    return self.add_submenu(Submenu::new(
      app_name.to_string(),
      Menu::new()
        .add_native_item(MenuItem::About(app_name.to_string()))
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Services)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit),
    ));
    #[cfg(not(target_os = "macos"))]
    return self;
  }
  fn add_default_file_submenu(self) -> Menu {
    self.add_submenu(Submenu::new(
      "Файл",
      Menu::new()
      .add_item(CustomMenuItem::new("create_new_file", "Создать новый файл"))
      .add_item(CustomMenuItem::new("open", "Открыть"))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::CloseWindow),
    ))
  }

  fn add_default_edit_submenu(self) -> Menu {
    self.add_submenu(Submenu::new("Правка", {
      let mut menu = Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste);
      #[cfg(not(target_os = "macos"))]
      {
        menu = menu.add_native_item(MenuItem::Separator);
      }
      menu = menu.add_native_item(MenuItem::SelectAll);
      menu
    }))
  }

  fn add_default_view_submenu(self) -> Menu {
    self.add_submenu(Submenu::new(
      "Вид",
      Menu::new().add_native_item(MenuItem::EnterFullScreen),
    ))
  }

  fn add_default_window_submenu(self) -> Menu {
    self.add_submenu(Submenu::new(
      "Окно",
      Menu::new()
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Zoom),
    ))
  }
}
