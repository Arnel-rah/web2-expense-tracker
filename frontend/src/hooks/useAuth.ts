import { useState, useEffect } from 'react';
import { authService } from '../services';
import { storageService } from '../services/storage.service';
import type { AuthResponse, User } from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = (err: unknown, defaultMessage: string): never => {
    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    if (response.token && response.user) {
      storageService.setToken(response.token);
      storageService.setUser(response.user);
      setUser(response.user);
    }
    return response;
  };

  const initializeAuth = () => {
    if (!storageService.isStorageAvailable()) {
      console.warn('LocalStorage non disponible');
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    const token = storageService.getToken();
    const storedUser = storageService.getUser();

    if (token && storedUser) {
      try {
        await getProfile();
      } catch (error) {
        console.warn('Token invalide ou expiré', error);
        storageService.clearAuth();
        setUser(null);
      }
    } else {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      return handleAuthSuccess(response);
    } catch (err) {
      handleAuthError(err, 'Erreur de connexion');
      return {} as AuthResponse;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.signup(email, password);
      return handleAuthSuccess(response);
    } catch (err) {
      handleAuthError(err, "Erreur d'inscription");
      return {} as AuthResponse;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    storageService.clearAuth();
    setUser(null);
  };

  const getProfile = async (): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.getProfile();
      if (response.user) {
        storageService.setUser(response.user);
        setUser(response.user);
        return response.user;
      }
      throw new Error('Aucun utilisateur dans la réponse');
    } catch (err) {
      const storedUser = storageService.getUser();
      
      if (storedUser) {
        console.warn('Utilisation des données stockées après erreur');
        setUser(storedUser);
        return storedUser;
      }

      storageService.clearAuth();
      setUser(null);
      handleAuthError(err, 'Erreur de profil');
      return {} as User;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const isAuthenticated = !!user && !!storageService.getToken();

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    getProfile,
    isAuthenticated
  };
};