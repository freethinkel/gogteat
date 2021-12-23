import { writable } from "svelte/store";
import { StorageService } from "../services/storage.service";

type FileEntry = {
  name: string;
  path: string;
};

const DEFAULT = {
  dir: "",
  files: [] as FileEntry[],
};

const store = writable(StorageService.get("projects") || DEFAULT);

store.subscribe((state) => {
  StorageService.set("projects", state);
});

export const projectsStore = {
  set: store.set,
  subscribe: store.subscribe,
  setProjects(dir: string, files: FileEntry[]) {
    store.set({
      dir,
      files,
    });
  },
};
