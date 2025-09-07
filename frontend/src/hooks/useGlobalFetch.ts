import { API_BASE_URL } from '../constants/api';
import { storageService } from '../services/storage.service';

interface FetchOptions extends RequestInit {
  timeout?: number;
  authRequired?: boolean;
}

class FetchService {
  private static async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { timeout = 3600, authRequired = false, headers = {}, ...restOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const defaultHeaders: HeadersInit = { 'Content-Type': 'application/json' };

      if (authRequired) {
        const token = storageService.getToken();
        if (!token) throw new Error('Authentication required');
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { ...defaultHeaders, ...headers },
        signal: controller.signal,
        ...restOptions,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  static get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static post<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static put<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  static delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default FetchService;