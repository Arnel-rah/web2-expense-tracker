import { useMemo } from 'react';
import { createDateRange, isInDateRange } from '../utils/utils.ts';
import type { Expense, Income } from '../types';
import type { FinancialCalculations } from '../types';

export const useFinancialCalculations = (
  expenses: Expense[],
  incomes: Income[],
  startDate: string,
  endDate: string,
  selectedCategories: Number[]
): FinancialCalculations => {
  return useMemo(() => {

    const { start, end } = createDateRange(startDate, endDate);

    const filteredIncomes = incomes.filter(income =>
      isInDateRange(income.date, start, end)
    );

    const filteredExpenses = expenses.filter(expense => {
      const matchesDate = isInDateRange(expense.date, start, end);
      const matchesCategory = selectedCategories.length === 0 || 
        (expense.category_id && selectedCategories.includes(expense.category_id));
      
      return matchesDate && matchesCategory;
    });

    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    const expenseRate = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    const largestExpense = filteredExpenses.reduce<Expense | null>((max, expense) => {
      return !max || expense.amount > max.amount ? expense : max;
    }, null);

    const isOverBudget = totalExpenses > totalIncome;
    const overBudgetAmount = Math.max(0, totalExpenses - totalIncome);

    console.log('Financial calculations result:', {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate: savingsRate.toFixed(2),
      expenseRate: expenseRate.toFixed(2),
      largestExpenseAmount: largestExpense?.amount || 0,
      isOverBudget,
      overBudgetAmount
    });

    return {
      filteredIncomes,
      filteredExpenses,
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      expenseRate,
      largestExpense,
      isOverBudget,
      overBudgetAmount
    };
  }, [expenses, incomes, startDate, endDate, selectedCategories]);
};