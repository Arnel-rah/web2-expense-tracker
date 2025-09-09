import { API_BASE_URL } from "../constants/api";

export const fetchData = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Erreur de récupération des ${endpoint}`);
  }
  
  return response.json();
};