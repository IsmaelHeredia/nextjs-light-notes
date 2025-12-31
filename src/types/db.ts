export type Workspace = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  id: string;
  text: string;
  idWorkspace: string;
  createdAt: string;
  updatedAt: string;
};
