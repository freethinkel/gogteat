export type FileItem = {
  name: string;
  path: string;
  project: Project;
};

export type Project = {
  name: string;
  path: string;
  files: FileItem[];
};
