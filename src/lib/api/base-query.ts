import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { env } from "@/lib/env";
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

/**
 * Better Auth uses httpOnly session cookies (`credentials: "include"`).
 * On 401 we clear local auth state — no refresh-token endpoint.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};
