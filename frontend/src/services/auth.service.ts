import FetchService from '../hooks/useGlobalFetch';
import { storageService } from './storage.service';
import type { AuthResponse, User } from '../types/Auth.types';

export class AuthService {
  private static async authRequest(endpoint: string, credentials: { email: string; password: string }): Promise<AuthResponse> {
    const data = await FetchService.post<AuthResponse>(endpoint, credentials);
    
    if (data.token) {
      storageService.setToken(data.token);
      if (data.user) storageService.setUser(data.user);
    }
    
    return data;
  }

  static login(email: string, password: string): Promise<AuthResponse> {
    return this.authRequest('/auth/login', { email, password });
  }

  static signup(email: string, password: string): Promise<AuthResponse> {
    return this.authRequest('/auth/signup', { email, password });
  }

  static getProfile(): Promise<User> {
    return FetchService.get<User>('/auth/me', { authRequired: true });
  }
}