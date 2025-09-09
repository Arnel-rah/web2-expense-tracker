const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options = {}) {
  const token = localStorage.getItem('token');
 if (!token) {
    window.location.href = '/login';
    return; 
  }
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || 'Erreur réseau';
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}
