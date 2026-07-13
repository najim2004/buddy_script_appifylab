import type { Middleware } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "@/lib/socket/socket-client";

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (typeof action === "object" && action !== null && "type" in action) {
    const type = (action as { type: string }).type;
    if (type === "auth/setCredentials") {
      const state = store.getState();
      connectSocket(state.auth?.accessToken);
    }
    if (type === "auth/logout") {
      disconnectSocket();
    }
  }

  return result;
};
