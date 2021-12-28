import { dialog, fs, path } from "@tauri-apps/api";
import { ProjectDoc, Project } from "../models/project";
import { DatabaseService } from "./database.service";

let instance: ProjectService | undefined;

export class ProjectService {
  private _appDir = "";

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
  }

  async updateDocumentContent(doc: ProjectDoc) {
    await new DatabaseService().execute(
      `UPDATE project_doc SET content = '${doc.content}' WHERE id = ${doc.id}`
    );
    return doc;
  }

  async removeDocument(doc: ProjectDoc): Promise<ProjectDoc> {
    await new DatabaseService().execute(
      `UPDATE project_doc SET is_removed = true WHERE id = ${doc.id};`
    );
    doc.isRemoved = true;
    return doc;
  }

  async importFile(): Promise<ProjectDoc> {
    const file = await dialog.open({
      filters: [
        {
          name: "markdown",
          extensions: ["md"],
        },
      ],
      multiple: false,
    });
    const fileName = file.toString().split(path.sep).pop();
    const fileContent = await fs.readTextFile(String(file));
    const [draftRaw] = await new DatabaseService().select(
      `SELECT * FROM projects WHERE is_draft = true;`
    );
    const draft = Project.fromStorage(draftRaw);
    const res = await new DatabaseService().execute(`
      INSERT INTO project_doc (name, content, project_id)
      VALUES ('${fileName}', '${fileContent}', ${draft.id});
    `);
    const [docRaw] = await new DatabaseService().select(
      `SELECT * FROM project_doc WHERE id = ${res.lastInsertId}`
    );
    const doc = ProjectDoc.fromStorage(docRaw);
    return doc;
  }

  async getDraft(): Promise<Project> {
    const [draft] = await new DatabaseService().select(
      `select * from projects where is_draft = true and is_removed = false;`
    );
    draft.documents = await new DatabaseService().select(`
      select * from project_doc where project_id = ${draft.id} and is_removed = false
    `);

    return Project.fromStorage(draft);
  }

  async getProjects(): Promise<Project[]> {
    const projects = await new DatabaseService()
      .select(
        `select * from projects where is_draft = false and is_removed = false;`
      )
      .then((_projects) => {
        return Promise.all(
          _projects.map(async (project) => {
            project.documents = await new DatabaseService().select(`
          select * from project_doc where project_id = ${project.id} and is_removed = false;
        `);
            return Project.fromStorage(project);
          })
        );
      });
    return projects;
  }

  async renameProject(project: Project, newName: string): Promise<Project> {
    await new DatabaseService().execute(
      `UPDATE projects SET name = '${newName}' WHERE id = ${project.id};`
    );
    project.name = newName;
    return project;
  }

  async renameDocument(
    document: ProjectDoc,
    newName: string
  ): Promise<ProjectDoc> {
    const res = await new DatabaseService().execute(
      `UPDATE project_doc SET name = '${newName}' WHERE id = ${document.id};`
    );
    document.name = newName;
    return document;
  }

  async createDocument(project: Project): Promise<ProjectDoc> {
    const res = await new DatabaseService().execute(`
      INSERT INTO project_doc (name, content, project_id)
      VALUES ('UNNAMED', '', ${project.id});
    `);
    const [doc] = await new DatabaseService().select(
      `select * from project_doc where id = ${res.lastInsertId}`
    );

    return ProjectDoc.fromStorage(doc);
  }

  async createNewProject(): Promise<Project> {
    const res = await new DatabaseService().execute(`
      INSERT INTO projects (name)
      VALUES ('Project');
    `);

    const [project] = await new DatabaseService().select(
      `select * from projects where id = ${res.lastInsertId}`
    );

    return Project.fromStorage(project);
  }

  async removeProject(project: Project): Promise<Project> {
    await new DatabaseService().execute(
      `UPDATE projects SET is_removed = true WHERE id = ${project.id} AND is_draft = false;`
    );
    project.isRemoved = true;
    return project;
  }
}
