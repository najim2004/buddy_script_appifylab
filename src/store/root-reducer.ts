import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "@/lib/api/api-slice";
import { authReducer } from "@/features/auth";
import { chatReducer } from "@/features/chat";

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  chat: chatReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
