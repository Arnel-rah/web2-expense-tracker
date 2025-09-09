export interface SummaryResponse {
  data?: any;
  error?: string;
  message?: string;
}

export interface ServiceError extends Error {
  status?: number;
  details?: any;
}