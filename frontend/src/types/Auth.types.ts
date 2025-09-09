export interface AuthProps {
  mode: 'login' | 'signup';
}

export interface AuthFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  message?: string;
  user?: User;
  token?: string;
}

export interface AuthError extends Error {
  status?: number;
  details?: any;
}

export interface User {
  user_id: number;
  email: string;
  password: string;
  created_at: string;
}