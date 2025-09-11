import type { Expense } from "./expenses.types"
import type { Income } from "./incomes.types"; 
import type { Category } from "./categories.types";

export interface FiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedCategories: Number[];
  onCategoriesChange: (categories: Number[]) => void;
  categories: Category[];
}

export interface FinancialItem {
  id: number;
  amount: number;
  date: string;
  category_id?: string;
}

export interface MonthlySummaryProps {
  summary: {
    total_income: number;
    total_expenses: number;
    totalExpenses: number;
    totalIncomes: number;
    balance: number;
  };
  expenses: Expense[];
  incomes: Income[];
  startDate: string;
  endDate: string;
  selectedCategories: Number[];
  categories: Category[];
}
