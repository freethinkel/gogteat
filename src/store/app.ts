import { writable, get } from "svelte/store";
import { editorStore } from "./editor";
import { EventEmitter } from "./EventEmitter";
import { projectsStore } from "./projects";

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
  async onSelectMenu(payload: string) {
    const handler = {
      open: () => projectsStore.pickFile(),
      create_new_file: () => {
        const currentProjectId = get(editorStore).document.projectId;
        if (currentProjectId) {
          const drafts = get(projectsStore).drafts;
          if (drafts.id === currentProjectId) {
            projectsStore.createDocument(drafts);
          } else {
            const project = get(projectsStore).projects.find(
              (p) => p.id === currentProjectId
            );
            projectsStore.createDocument(project);
          }
        }
      },
    }[payload];

    if (handler) {
      handler();
    }
  },
  channel: new EventEmitter(),
};
