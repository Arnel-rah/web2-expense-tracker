import { useState, useCallback } from 'react';
import { receiptService } from '../services';
import type { UploadReceiptResponse } from '../types/receipts.types';
import toast from 'react-hot-toast';

export const useReceipts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadReceiptResponse | null>(null);

  const downloadReceipt = useCallback(async (expenseId: number | string, format: 'application/pdf' | 'image/jpeg' | 'image/png') => {
    setLoading(true);
    setError(null);

    try {
      const blob = await receiptService.downloadReceipt(expenseId, format);
      const filename = receiptService.downloadUtils.generateFilename(expenseId, format);
      receiptService.downloadUtils.downloadBlob(blob, filename);
      
      toast.success('Téléchargement réussi !');
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de téléchargement';
      setError(errorMessage);
      toast.error(`Erreur de téléchargement: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadReceipt = useCallback(async (file: File, expenseId: number | string) => {
    setLoading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await receiptService.uploadReceipt(file, expenseId);
      setUploadResult(result);
      toast.success('Fichier uploadé avec succès !');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'upload";
      setError(errorMessage);
      toast.error(`Erreur d'upload: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearUploadResult = useCallback(() => {
    setUploadResult(null);
  }, []);

  return {
    loading,
    error,
    uploadResult,
    downloadReceipt,
    uploadReceipt,
    clearError,
    clearUploadResult
  };
};