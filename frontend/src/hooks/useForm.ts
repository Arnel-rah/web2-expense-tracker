import { useState } from "react";
import { apiFetch } from "../api/api";

export default function useForm(initialValues: object, endpointBase: string) {
  const [formData, setFormData] = useState(initialValues);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e: { target: { name: string; value: unknown; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const isUpdate = !!formData.id; 

    const endpoint = isUpdate
      ? `${endpointBase}/${formData.id}`
      : endpointBase;

    const method = isUpdate ? "PUT" : "POST";

    try {
      await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData),
      });
      setSuccess(isUpdate ? "!" : "Ajout réussi !");
    } catch (err) {
      setError(err.message || "Erreur");
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    success,
    error,
  };
}
