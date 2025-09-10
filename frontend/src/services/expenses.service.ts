import { useState, useEffect } from "react";
import type { Expense } from "../types";
import { fetchData } from "../utils/fetchUtils";

export const expenseService = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    try {
      const [ expensesData ] = await Promise.all([fetchData('expenses')]);

      setExpenses(expensesData);
    } catch (error) {
      console.error('Erreur de chargement des données:', error);
    }
  };

  useEffect(() => { fetchExpenses() }, []);

  return { expenses };
};
