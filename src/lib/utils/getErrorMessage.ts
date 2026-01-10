// src/lib/utils/getErrorMessage.ts

import axios from "axios";

export const getErrorMessage = (error: unknown, fallback: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || fallback;
    throw new Error(message);
  }
  throw new Error(fallback);
};
