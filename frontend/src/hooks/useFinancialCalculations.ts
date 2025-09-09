import { useMemo } from 'react';
import { createDateRange, isInDateRange } from '../utils/utils.ts';
import type { Expense, Income } from '../types';

export const useFinancialCalculations = (
  expenses: Expense[],
  incomes: Income[],
  startDate: string,
  endDate: string,
  selectedCategories: string[]
) => useMemo(() => {
  const { start, end } = createDateRange(startDate, endDate);
  
  const filteredIncomes = incomes.filter(income => isInDateRange(income.date, start, end));
  const filteredExpenses = expenses.filter(expense =>
    isInDateRange(expense.date, start, end) &&
    (selectedCategories.length === 0 || (expense.category_id && selectedCategories.includes(expense.category_id)))
  );

  const totalIncome = filteredIncomes.reduce((sum, { amount }) => sum + amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, { amount }) => sum + amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const expenseRate = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
  const largestExpense = filteredExpenses.length > 0
    ? filteredExpenses.reduce((max, expense) => expense.amount > max.amount ? expense : max, filteredExpenses[0])
    : null;

  return {
    filteredIncomes,
    filteredExpenses,
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    expenseRate,
    largestExpense,
    isOverBudget: totalExpenses > totalIncome,
    overBudgetAmount: Math.max(0, totalExpenses - totalIncome),
  };
}, [expenses, incomes, startDate, endDate, selectedCategories]);