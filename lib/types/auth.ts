// src/types/auth.ts

export interface User {
  _id: string;
  name: string;
  username: string;
  role: "admin" | "employee";
  employeeId?: string;
  category?: {
    _id: string;
    name: string;
    prefix: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}
