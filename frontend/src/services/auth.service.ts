import { API_BASE_URL } from "../constants/api";
import type { AuthResponse, AuthError } from "../types/auth.types";

export const authService = {
  /**
   * Connecte un utilisateur avec son email et mot de passe
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw new Error('Échec de la connexion. Veuillez réessayer.');
    }
  },

  /**
   * Inscrit un nouvel utilisateur
   */
  signup: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw new Error("Échec de l'inscription. Veuillez réessayer.");
    }
  },

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getProfile: async (): Promise<AuthResponse> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      const error = new Error("Token d'authentification manquant") as AuthError;
      error.status = 401;
      throw error;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw new Error('Impossible de récupérer le profil utilisateur.');
    }
  }
};