import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-query";

/**
 * Shared RTK Query API — caching defaults:
 * - keepUnusedDataFor: retain unused cache for 60s
 * - refetchOnMountOrArgChange: reuse cache if younger than 30s
 * - focus/reconnect refetch via setupListeners in the store
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Chat", "Message", "Post", "Comment"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
