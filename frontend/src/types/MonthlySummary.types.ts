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
  expenses: FinancialItem[];
  incomes: FinancialItem[];
  startDate: string;
  endDate: string;
  selectedCategories: string[];
  onReload?: () => Promise<void>;
}