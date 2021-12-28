import { fs } from "@tauri-apps/api";
import { writable } from "svelte/store";
import { debounceTime } from "../helpers";
import type { Project, ProjectDoc } from "../models/project";
import { projectsStore } from "./projects";

const DEFAULT = {
  document: null as ProjectDoc | null,
};

const store = writable(DEFAULT);

const updateDocument = (document: ProjectDoc) => {
  projectsStore.updateDocumentContent(document);
};

const debounceUpdateDocument = debounceTime(300, updateDocument);

store.subscribe((state) => {
  if (state.document) {
    debounceUpdateDocument(state.document);
  }
});

export const editorStore = {
  set: store.set,
  subscribe: store.subscribe,
  updateContent(content) {
    store.update((state) => {
      state.document.content = content;
      return state;
    });
  },
  setDocument(document: ProjectDoc) {
    store.update((state) => {
      state.document = document;
      return state;
    });
  },
};
