import { writable } from "svelte/store";
import {
  SET_RENAME_DOCUMENT_ACTION,
  SET_RENAME_PROJECT_ACTION,
} from "../constants";
import type { Project, ProjectDoc } from "../models/project";
import { ProjectService } from "../services/projects.services";
import { appStore } from "./app";
import { editorStore } from "./editor";

const DEFAULT = {
  dir: "",
  projects: [] as Project[],
  drafts: {
    id: null,
    name: "Drafts",
    isDraft: false,
    documents: [],
  } as Project,
};

const store = writable(DEFAULT);

const projectService = new ProjectService();

export const projectsStore = {
  set: store.set,
  subscribe: store.subscribe,
  async updateDocumentContent(document: ProjectDoc) {
    await projectService.updateDocumentContent(document);
  },
  async removeDocument(document: ProjectDoc) {
    const doc = await projectService.removeDocument(document);
    store.update((state) => {
      const currentProject =
        state.drafts.id === doc.projectId
          ? state.drafts
          : state.projects.find((p) => p.id === doc.projectId);
      currentProject.documents = currentProject.documents.map((d) =>
        d.id === doc.id ? doc : d
      );
      return state;
    });
  },
  async removeProject(project: Project) {
    const newProject = await projectService.removeProject(project);
    store.update((state) => {
      state.projects = state.projects.map((p) =>
        p.id === project.id ? newProject : p
      );
      return state;
    });
  },
  async createDocument(project: Project) {
    const doc = await projectService.createDocument(project);
    store.update((state) => {
      const _project =
        state.drafts.id === project.id
          ? state.drafts
          : state.projects.find((p) => p.id === project.id);
      _project.documents.push(doc);
      return state;
    });

    editorStore.setDocument(doc);
  },
  async createProject() {
    const project = await projectService.createNewProject();
    store.update((state) => {
      state.projects.push(project);
      return state;
    });
    setTimeout(() => {
      appStore.channel.emit(SET_RENAME_PROJECT_ACTION, project);
    }, 100);
  },
  async renameDocument(document: ProjectDoc, name: string) {
    const doc = await projectService.renameDocument(document, name);
    store.update((state) => {
      const currentProject =
        state.drafts.id === doc.projectId
          ? state.drafts
          : state.projects.find((p) => p.id === doc.projectId);

      currentProject.documents = currentProject.documents.map((d) =>
        d.id === doc.id ? doc : d
      );
      return state;
    });
  },
  async renameProject(project: Project, newName: string) {
    const newProject = await projectService.renameProject(project, newName);
    store.update((state) => {
      state.projects = state.projects.map((p) =>
        p.id === project.id ? newProject : p
      );
      return state;
    });
  },
  async pickFile() {
    const doc = await projectService.importFile();
    store.update((state) => {
      state.drafts.documents.push(doc);
      return state;
    });
  },
  async getAllData() {
    const draft = await projectService.getDraft();
    const projects = await projectService.getProjects();
    if (draft.documents.length) {
      const docs = draft.documents.filter((doc) => !doc.isRemoved);
      if (docs.length) {
        editorStore.setDocument(docs[0]);
      }
    }
    store.update((state) => {
      state.projects = projects;
      state.drafts = draft;
      return state;
    });
  },
};
