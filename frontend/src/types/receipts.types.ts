export interface Receipt {
  receipt_id: number;
  user_id: number;
  file_path: string;
  file_type: string;
  uploaded_at: string;
}

export interface UploadReceiptResponse {
  message: string;
  file: Receipt;
}

export interface ApiError {
  message: string;
  status?: number;
}