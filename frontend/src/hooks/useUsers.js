// useUsers.js
import { useState } from 'react';

export function useUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTransaction = async () => { /* GET logic */
    setLoading(true);
    setError(null);

    try{
      const response = await fetch(`${BASE_URL}/expenses`,{
        
      })
    }

   };
  // const createUser = async (userData) => { /* POST logic */
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch('/api/users', {
  //       method: 'POST', 
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Erreur lors de la création de l’utilisateur');
  //     } const data = await response.json();
  //     return data;
  //   } catch (err) {
  //     setError(err.message);
  //     console.error(err);
  //   } finally {
  //     setLoading(false);

  //   }
  // };

  const updateUser = async (id, userData) => { /* PUT/PATCH logic */ };
  const deleteUser = async (id) => { /* DELETE logic */ };

  return {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    loading,
    error,
  };
}
