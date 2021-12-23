import { writable } from "svelte/store";

const DEFAULT = {
  fileName: null as string | null,
  content: "",
};

const store = writable(DEFAULT);

export const editorStore = {
  set: store.set,
  subscribe: store.subscribe,
  updateContent(content) {
    store.update((state) => {
      state.content = content;
      return state;
    });
  },
  setFile(name: string, fileContent: string) {
    store.update((state) => {
      state.content = fileContent;
      state.fileName = name;

      return state;
    });
  },
};
