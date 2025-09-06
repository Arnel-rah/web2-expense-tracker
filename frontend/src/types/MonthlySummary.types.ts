export interface Expense {
  id: number;
  amount: number;
  date: string;
  category_id: string;
  description?: string | null;
  type: 'one-time' | 'recurring';
  start_date?: string | null;
  end_date?: string | null;
  receipt?: string | null;
  user_id: number;
  created_at?: string;
}

export interface Income {
  id: number;
  amount: number;
  date: string;
  source: string;
  description?: string | null;
  user_id: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  user_id: number;
  created_at?: string;
  color?: string;
}

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