import { writable } from "svelte/store";
import { projectsStore } from "./projects";

export type ContextMenuItem = {
  text: string;
  type: string | number;
  payload?: any;
};

const DEFAULT = {
  editorInstance: null,
  previewMode: false,
  contextMenu: {
    isOpen: false,
    items: [] as ContextMenuItem[],
    props: {} as { x?: number; y?: number },
    payload: null as ContextMenuItem | null,
  },
};

const store = writable<typeof DEFAULT>(DEFAULT);

export const appStore = {
  set: store.set,
  subscribe: store.subscribe,
  closeContextMenu(payload: ContextMenuItem | null) {
    const handler = {
      create_new_document: () => {
        projectsStore.createDocument(payload.payload);
      },
      remove_project: () => {
        projectsStore.removeProject(payload.payload);
      },
      remove_document: () => {
        projectsStore.removeDocument(payload.payload);
      },
    }[payload?.type];

    if (handler) {
      handler();
    }

    store.update((state) => {
      state.contextMenu = {
        isOpen: false,
        items: [],
        props: {},
        payload: payload,
      };
      return state;
    });
  },
  openContextMenu(items: ContextMenuItem[]) {
    return (e: MouseEvent) => {
      e.stopPropagation();
      store.update((state) => {
        state.contextMenu.isOpen = true;
        state.contextMenu.items = items;
        state.contextMenu.props = {
          x: e.clientX,
          y: e.clientY,
        };

        return state;
      });
    };
  },
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
};
