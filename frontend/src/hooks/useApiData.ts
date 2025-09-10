import { useState, useEffect } from "react";
import { API_BASE_URL } from "../constants/api";
import type { Expense , Income, Category } from "../types";


export const useApiData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const createAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchData = async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: createAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de récupération des ${endpoint}`);
    }
    
    return response.json();
  };

  const loadAllData = async () => {
    try {
      const [categoriesData, expensesData, incomesData] = await Promise.all([
        fetchData('categories'),
        fetchData('expenses'),
        fetchData('incomes')
      ]);

      setCategories(categoriesData);
      setExpenses(expensesData);
      setIncomes(incomesData);
    } catch (error) {
      console.error('Erreur de chargement des données:', error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return { expenses, incomes, categories };
};
