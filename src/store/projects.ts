import { dialog, fs, path } from "@tauri-apps/api";
import { get, writable } from "svelte/store";
import type { Project } from "../models/project";
import { ProjectService } from "../services/projects.services";
import { StorageService } from "../services/storage.service";
import { editorStore } from "./editor";

type FileEntry = {
  name: string;
  path: string;
};

const DEFAULT = {
  dir: "",
  files: [] as FileEntry[],
  projects: [] as Project[],
};

const store = writable(DEFAULT);

store.subscribe((state) => {
  StorageService.set("projects", state);
});

const projectService = new ProjectService();

export const projectsStore = {
  set: store.set,
  subscribe: store.subscribe,
  async pickFile() {
    const file = await dialog.open({
      filters: [
        {
          name: "markdown",
          extensions: ["md"],
        },
      ],
      multiple: false,
    });
    const editorStoreValue = get(editorStore);
    if (editorStoreValue.filePath) {
      const dirPath = editorStoreValue.filePath
        .split(path.sep)
        .slice(0, -1)
        .join(path.sep);

      fs.copyFile(String(file), dirPath);
      this.readProjects();
    }
  },
  async readProjects() {
    const projects = await projectService.getProjects();
    console.log(projects);
    store.update((state) => {
      state.projects = projects;
      return state;
    });
  },
};
