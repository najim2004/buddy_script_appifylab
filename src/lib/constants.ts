export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  THEME: "theme",
} as const;

export const QUERY_DEFAULTS = {
  PAGE_SIZE: 20,
  DEBOUNCE_MS: 400,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
} as const;
