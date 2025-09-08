import { API_BASE_URL } from "../constants/api"

export interface Receipt {
  receipt_id: number;
  user_id: number;
  file_path: string;
  file_type: string;
  uploaded_at: string;
}

export interface UploadReceiptResponse {
  message: string;
  file: Receipt;
}

export interface ApiError {
  message: string;
  status?: number;
}

export const receiptService = {
  /**
   * Télécharge un reçu pour une dépense spécifique
   */
  downloadReceipt: async (expenseId: number | string, format: 'application/pdf' | 'image/jpeg' | 'image/png'): Promise<Blob> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_BASE_URL}/receipts/${expenseId}`, {
      method: 'GET',
      headers: {
        'Accept': format,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur de téléchargement' }));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.blob();
  },

  /**
   * Upload un fichier de reçu
   */
  uploadReceipt: async (file: File, expenseId: number | string): Promise<UploadReceiptResponse> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('expenseId', expenseId.toString());

    const response = await fetch(`${API_BASE_URL}/receipts/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur d\'upload' }));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Récupère les informations metadata d'un reçu (sans le fichier)
   */
  getReceiptInfo: async (expenseId: number | string): Promise<Receipt> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_BASE_URL}/receipts/${expenseId}/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur de récupération' }));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Utilitaires pour gérer le téléchargement du fichier dans le navigateur
   */
  downloadUtils: {
    /**
     * Télécharge un blob comme fichier dans le navigateur
     */
    downloadBlob: (blob: Blob, filename: string): void => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },

    /**
     * Génère un nom de fichier basé sur le type MIME
     */
    generateFilename: (expenseId: number | string, mimeType: string): string => {
      const extensions: Record<string, string> = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png'
      };

      const extension = extensions[mimeType] || 'bin';
      return `receipt-${expenseId}.${extension}`;
    }
  }
};

// Exemple d'utilisation :
/**/
// Télécharger un reçu
try {
  const blob = await receiptService.downloadReceipt(4, 'application/pdf');
  const filename = receiptService.downloadUtils.generateFilename('test123', 'application/pdf');
  receiptService.downloadUtils.downloadBlob(blob, filename);
} catch (error) {
  console.error('Erreur de téléchargement:', error);
}
/*
// Uploader un reçu
try {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];
  const result = await receiptService.uploadReceipt(file, 123);
  console.log('Upload réussi:', result);
} catch (error) {
  console.error('Erreur d\'upload:', error);
}
*/