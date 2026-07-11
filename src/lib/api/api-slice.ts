import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-query";

/**
 * Root RTK Query API. Feature slices extend this via `injectEndpoints`
 * so endpoints stay colocated with their feature and benefit from code-splitting.
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Chat", "Message"],
  endpoints: () => ({}),
});
