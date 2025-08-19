// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from '../services/backend';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = getCurrentUser();
        console.log('useAuth - Current user:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return { user, loading, logout };
};