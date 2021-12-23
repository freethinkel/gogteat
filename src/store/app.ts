import { writable } from "svelte/store";

const DEFAULT = {
  editorInstance: null,
};

const store = writable(DEFAULT);

export const appStore = {
  set: store.set,
  subscribe: store.subscribe,
  setEditorInstance(instance) {
    store.update((state) => {
      state.editorInstance = instance;
      return state;
    });
  },
};
