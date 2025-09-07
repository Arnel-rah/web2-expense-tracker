import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { storageService } from '../services/storage.service';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const token = storageService.getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const storedUser = storageService.getUser();
      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
        return;
      }

      const userData = await AuthService.getProfile();
      setUser(userData);
    } catch {
      storageService.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const authAction = useCallback(async (action: 'login' | 'signup', email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService[action](email, password);
      setUser(response.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `${action} failed`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => authAction('login', email, password);
  const signup = (email: string, password: string) => authAction('signup', email, password);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    signup,
    isAuthenticated: !!user,
  };
};