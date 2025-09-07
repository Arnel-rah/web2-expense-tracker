export interface AuthProps {
  mode: 'login' | 'signup';
}

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: User;
}

export interface User {
  id: number;
  email: string;
  createdAt: string;
}