import { fs } from "@tauri-apps/api";
import { writable } from "svelte/store";
import { debounceTime } from "../helpers";
import type { FileItem } from "../models/project";

const DEFAULT = {
  fileName: null as string | null,
  filePath: null as string | null,
  content: "",
};

const store = writable(DEFAULT);

const updateFile = (path: string, content: string) => {
  console.log("update file", content.length);
  fs.writeFile({ path, contents: content });
};

const debounceUpdateFile = debounceTime(300, updateFile);

store.subscribe((state) => {
  if (state.filePath) {
    debounceUpdateFile(state.filePath, state.content);
  }
});

export const editorStore = {
  set: store.set,
  subscribe: store.subscribe,
  updateContent(content) {
    store.update((state) => {
      state.content = content;
      return state;
    });
  },
  setFile(file: FileItem, content: string) {
    store.update((state) => {
      state.content = content;
      state.fileName = file.name;
      state.filePath = file.path;

      return state;
    });
  },
};
