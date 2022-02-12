import { writable } from "svelte/store";
import { EventEmitter } from "./EventEmitter";

export type AppAction = string;

const DEFAULT = {
  editorInstance: null,
  previewMode: false,
};

const store = writable<typeof DEFAULT>(DEFAULT);

export const appStore = {
  set: store.set,
  subscribe: store.subscribe,
  togglePreview() {
    store.update((state) => {
      state.previewMode = !state.previewMode;
      return state;
    });
  },
  setEditorInstance(instance) {
    store.update((state) => {
      state.editorInstance = instance;
      return state;
    });
  },
  channel: new EventEmitter(),
};
