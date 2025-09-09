import { API_BASE_URL } from '../constants/api';
import { storageService } from './storage.service';

export interface Category {
  id: number;
  name: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const token = storageService.getToken();
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const categories: Category[] = await response.json();
      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw new Error('Impossible de récupérer les catégories');
    }
  },

  async createCategory(name: string): Promise<Category> {
    const token = storageService.getToken();
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    if (!name || name.trim() === '') {
      throw new Error('Le nom de la catégorie est requis');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      throw new Error('Impossible de créer la catégorie');
    }
  },

  async updateCategory(categoryId: number, name: string): Promise<Category> {
    const token = storageService.getToken();
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    if (!name || name.trim() === '') {
      throw new Error('Le nom de la catégorie est requis');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      throw new Error('Impossible de mettre à jour la catégorie');
    }
  },

  async deleteCategory(categoryId: number): Promise<void> {
    const token = storageService.getToken();
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      throw new Error('Impossible de supprimer la catégorie');
    }
  }
};