export class Project {
  id: number;
  name: string;
  isDraft: boolean;
  isRemoved: boolean;
  documents: ProjectDoc[];

  static fromStorage(model: any): Project {
    return {
      id: model.id,
      name: model.name,
      isDraft: model.is_draft,
      documents:
        model.documents?.map((doc) => ProjectDoc.fromStorage(doc)) || [],
      isRemoved: model.is_removed,
    };
  }
}

export class ProjectDoc {
  id: number;
  projectId: number;
  isRemoved: boolean;
  name: string;
  content: string;

  static fromStorage(model: any): ProjectDoc {
    return {
      id: model.id,
      name: model.name,
      content: model.content,
      projectId: model.project_id,
      isRemoved: model.is_removed,
    };
  }
}
