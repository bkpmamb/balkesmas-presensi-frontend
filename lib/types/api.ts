// src/types/api.ts
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  response?: {
    data?: {
      success: boolean;
      message: string;
      error?: string;
    };
    status?: number;
  };
}
