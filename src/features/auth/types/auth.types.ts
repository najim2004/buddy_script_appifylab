/** Backend GET /auth/me `data` — use as-is (no camelCase remap). */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  type: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
