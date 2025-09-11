import { useMemo } from 'react';
import type { Category, Expense, Income, SummaryForm } from '../types'; 

export interface DataProps {
  summary: SummaryForm;
  expenses: Expense[];
  incomes: Income[];
  startDate: string;
  endDate: string;
  selectedCategories: Number[];
  categories: Category[];
}

export interface DataPropsInput {
  summary: SummaryForm;
  expenses: Expense[];
  incomes: Income[];
  startDate: string;
  endDate: string;
  selectedCategories: Number[];
  categories: Category[];
}

export const getDataProps = (input: DataPropsInput): DataProps => {
  const {
    summary,
    expenses,
    incomes,
    startDate,
    endDate,
    selectedCategories,
    categories
  } = input;

  const normalizeDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };
    
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = normalizeDate(expense.created_at);
    
    return ((selectedCategories.length === 0) || selectedCategories.includes(expense.category_id)) 
        &&
        (expenseDate >= startDate && expenseDate <= endDate)
  });

  const filteredIncomes = incomes.filter(income => {
    const incomeDate = normalizeDate(income.created_at);
    const isInDateRange = (incomeDate >= startDate) && 
                         (incomeDate <= endDate);
    return isInDateRange;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const totalIncomes = filteredIncomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);
  const balance = totalIncomes - totalExpenses;

  const formattedSummary = {
    ...summary,
    total_expenses: Number(summary.total_expenses),
    total_income: Number(summary.total_income),
    totalExpenses,
    totalIncomes,
    balance
  };

  return {
    summary: formattedSummary,
    expenses: filteredExpenses,
    incomes: filteredIncomes,
    startDate,
    endDate,
    selectedCategories,
    categories
  };
};

export const useDataProps = (input: DataPropsInput): DataProps => {
  return useMemo(() => {
    return getDataProps(input);
  }, [
    input.summary,
    input.expenses,
    input.incomes,
    input.startDate,
    input.endDate,
    JSON.stringify(input.selectedCategories),
    JSON.stringify(input.categories)
  ]);
};