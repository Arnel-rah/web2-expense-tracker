const BASE_URL = import.meta.env.VITE_API_URL; 

export async function apiFetch(endpoint : string, options = {}) {
  const headers: object = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers, 
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || 'Erreur réseau';
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}
