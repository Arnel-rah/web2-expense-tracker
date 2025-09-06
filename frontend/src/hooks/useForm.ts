import { useState } from "react";
import { apiFetch } from "../api/api";

export interface FormDataBase{
  id?: number;
}

export default function useForm<T extends FormDataBase>(initialValues: T, endpointBase: string) {
  const [formData, setFormData] = useState(initialValues);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    const isUpdate = !!formData.id; 
    const endpoint = isUpdate ? `${endpointBase}/${formData.id}` : endpointBase;
    const method = isUpdate ? "PUT" : "POST";

    try {
      await apiFetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      setSuccess(isUpdate ? "Mise à jour réussie !" : "Ajout réussi !");
      
      if (!isUpdate) {
        setFormData(initialValues);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialValues);
    setSuccess(null);
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    success,
    error,
    loading,
    resetForm
  };
}