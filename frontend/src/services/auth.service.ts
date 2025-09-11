import { API_BASE_URL } from "../constants/api";
import { storageService } from "./storage.service";
import type { AuthResponse } from "../types";

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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur de connexion (${response.status})`);
      }

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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur d'inscription (${response.status})`);
      }

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
    const token = storageService.getToken();
    
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 500) {
        console.warn('Erreur 500 du serveur sur /auth/me - utilisation des données stockées');
        const storedUser = storageService.getUser();
        if (storedUser) {
          return { user: storedUser };
        }
        throw new Error('Erreur serveur et aucune donnée utilisateur stockée');
      }

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          storageService.clearAuth();
        }
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      
      const storedUser = storageService.getUser();
      if (storedUser) {
        console.warn('Utilisation des données utilisateur stockées comme fallback');
        return { user: storedUser };
      }
      
      throw new Error('Impossible de récupérer le profil utilisateur');
    }
  }
};