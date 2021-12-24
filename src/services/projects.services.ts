import { fs, path } from "@tauri-apps/api";
import type { FileItem, Project } from "../models/project";

const PROJECTS_FOLDER = "projects";
const UNCATEGORIZED_DIR = "";
const TRASH_FOLD = ".trash";

let instance: ProjectService | undefined;

export class ProjectService {
  private _appDir = "";
  private _projectsDir = "";

  constructor() {
    if (instance) {
      return instance;
    } else if (!instance) {
      instance = this;
    }

    this._init();
  }

  private async _init() {
    this._appDir = await path.appDir();
    this._projectsDir = this._appDir + PROJECTS_FOLDER;
    await fs.readDir(this._projectsDir).catch(async (err) => {
      await fs.createDir(this._appDir);
      await fs.createDir(this._projectsDir);
      await fs.createDir(this._projectsDir + path.sep + UNCATEGORIZED_DIR);
    });
  }

  async getProjects(): Promise<Project[]> {
    const dirs = (
      await fs.readDir(this._projectsDir, { recursive: true })
    ).filter((dir) => dir.children);

    return dirs.map((dir) => {
      const project = {
        name: dir.name,
        path: dir.path,
        files: [],
      };

      project.files =
        dir.children?.map((file) => ({
          name: file.name,
          path: file.path,
          project,
        })) || [];

      return project;
    });
  }

  async renameProject(project: Project, newName: string) {
    const newPath =
      project.path.split(path.sep).slice(0, -1).join(path.sep) +
      path.sep +
      newName;
    await fs.renameFile(project.path, newPath);
  }

  async createFile(project: Project, fileName: string): Promise<FileItem> {
    const file = {
      name: fileName,
      path: project.path + path.sep + fileName,
      project,
    };
    await fs.writeFile({ path: file.path, contents: "" });
    return file;
  }

  async createNewProject(name: string): Promise<Project> {
    const project = {
      name: name,
      path: this._projectsDir + path.sep + name,
      files: [],
    };
    await fs.createDir(project.path);

    return project;
  }

  async deleteProject(project: Project) {
    // TODO: Move to trash
    await fs.removeDir(project.path);
  }
}
