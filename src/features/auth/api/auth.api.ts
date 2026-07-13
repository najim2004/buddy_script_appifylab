import { apiSlice } from "@/lib/api/api-slice";
import { unwrapData } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/types/api.types";
import { setUser, logout } from "../store/auth.slice";
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth.types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<unknown, LoginRequest>({
      query: (body) => ({ url: "/auth/sign-in", method: "POST", body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const me = await dispatch(
            authApi.endpoints.getMe.initiate(undefined, {
              forceRefetch: true,
            }),
          ).unwrap();
          dispatch(authApi.util.upsertQueryData("getMe", undefined, me));
          dispatch(setUser(me));
        } catch {
          // handled by the calling component
        }
      },
    }),

    register: builder.mutation<unknown, RegisterRequest>({
      query: (body) => ({ url: "/auth/sign-up", method: "POST", body }),
    }),

    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      keepUnusedDataFor: 300,
      transformResponse: (response: ApiResponse<User>) => unwrapData(response),
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // 401 → base query clears auth state
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/sign-out", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
