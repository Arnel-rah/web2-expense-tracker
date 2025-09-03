const BASE_URL = import.meta.env.VITE_API_URL; // récupérée de ton .env

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('authToken'); // récupère le token

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers, // permet de personnaliser les headers
  };

  const config = {
    ...options,
    headers, // headers bien regroupés ici
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      // Optionnel : rediriger vers la page de connexion
      // window.location.href = '/login';
    }

    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || 'Erreur réseau';
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}
