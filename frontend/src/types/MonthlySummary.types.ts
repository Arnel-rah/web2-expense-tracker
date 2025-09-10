import type { Expense } from "./expenses.types"
import type { Income } from "./incomes.types"; 
import type { Category } from "./categories.types";

export interface FiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  categories: Category[];
}

export interface FinancialItem {
  id: number;
  amount: number;
  date: string;
  category_id?: string;
}

export interface MonthlySummaryProps {
  summary?: {
    total_income: number | string;
    total_expenses: number | string;
    balance: number;
  };
  expenses: Expense[];
  incomes: Income[];
  startDate: string;
  endDate: string;
  selectedCategories: string[];
}

export interface FinancialCalculations {
  filteredIncomes: Income[];
  filteredExpenses: Expense[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  expenseRate: number;
  largestExpense: Expense | null;
  isOverBudget: boolean;
  overBudgetAmount: number;
}
