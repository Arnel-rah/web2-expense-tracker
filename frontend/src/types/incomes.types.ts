export interface Income {
  income_id: number;
  user_id: number;
  source: string;
  description?: string | null;
  amount: number;
  date: string;
  created_at: string;
}
