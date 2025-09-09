import { API_BASE_URL } from "../constants/api";
import { storageService } from "./storage.service";
import type { SummaryResponse } from "../types/summary.types";


const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
  return response.json();
};

export const summaryService = {
  /**
   * Récupère le résumé mensuel
   */
  monthlySummary: async (): Promise<SummaryResponse> => {
    try {
      const token = storageService.getToken();
      const response = await fetch(`${API_BASE_URL}/summary/monthly`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé mensuel:', error);
      throw new Error('Impossible de récupérer le résumé mensuel.');
    }
  },
  
  /**
   * Récupère le résumé général
   */
  summary: async (): Promise<SummaryResponse> => {
    try {
      const token = storageService.getToken();
      const response = await fetch(`${API_BASE_URL}/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé:', error);
      throw new Error('Impossible de récupérer le résumé.');
    }
  },

  /**
   * Récupère les alertes
   */
  // alerts: async (): Promise<SummaryResponse> => {
  //   try {
  //     const token = storageService.getToken();
  //     const response = await fetch(`${API_BASE_URL}/summary/alerts`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     return await handleResponse(response);
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des alertes:', error);
  //     throw new Error('Impossible de récupérer les alertes.');
  //   }
  // }
};