export interface SummaryForm {
  total_income: number;
  total_expenses: number;
  balance: number;
}

export interface SummaryResponse extends SummaryForm {
  error?: string;
  message?: string;
  status?: number;
}

export interface ServiceError extends Error {
  status?: number;
  details?: any;
}