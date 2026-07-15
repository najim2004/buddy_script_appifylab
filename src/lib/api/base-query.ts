import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import type { RootState } from "@/store";
import { logout } from "@/features/auth/store/auth.slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

let loggingOut = false;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  const url = typeof args === "string" ? args : args.url;

  if (url.includes("/auth/sign-in") || url.includes("/auth/sign-up")) {
    return result;
  }

  if (url.includes("/auth/sign-out")) {
    api.dispatch(logout());
    api.dispatch({ type: "api/resetApiState" });
    return result;
  }

  const { isAuthenticated } = (api.getState() as RootState).auth;
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const onAuthPage = path === ROUTES.LOGIN || path === ROUTES.REGISTER;

  if (!isAuthenticated && onAuthPage) {
    api.dispatch(logout());
    return result;
  }

  if (loggingOut) return result;
  loggingOut = true;

  try {
    await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/sign-out`, {
      method: "POST",
      credentials: "include",
    });
  } catch {}

  api.dispatch(logout());
  api.dispatch({ type: "api/resetApiState" });

  if (typeof window !== "undefined" && !onAuthPage) {
    const next = window.location.pathname + window.location.search;
    const login = new URL(ROUTES.LOGIN, window.location.origin);
    if (next && next !== "/") login.searchParams.set("next", next);
    window.location.assign(login.toString());
  } else {
    loggingOut = false;
  }

  return result;
};
