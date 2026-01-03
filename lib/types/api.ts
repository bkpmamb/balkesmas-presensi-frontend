// src/types/api.ts
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: ApiErrorResponse;
}
