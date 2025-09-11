export interface Expense {
  expense_id: number;
  user_id: number;
  type: 'one-time' | 'recurring';
  description?: string | null;
  amount: number;
  start_date?: string | null;
  end_date?: string | null;
  date: string;
  created_at: string;
  receipt?: string | null;
  category_id: number;
}