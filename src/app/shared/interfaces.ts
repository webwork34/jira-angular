export interface User {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export interface FbLoginResponse {
  idToken: string;
  expiresIn: string;
  email: string;
}

export interface Task {
  assignee: string;
  date: Date | string;
  description?: string;
  priority: string;
  title: string;
  type: string;
  status: string;
  id: string;
}

export interface FbRegisterResponse {
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
}

export interface FbCreateResponse {
  name: string;
}
