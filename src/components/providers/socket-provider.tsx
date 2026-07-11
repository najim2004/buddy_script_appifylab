"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/socket/socket-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setConnected } from "@/features/chat/store/chat.slice";

const SocketContext = createContext<Socket | null>(null);

/** Access the shared socket instance. */
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  // Stable singleton instance exposed through context.
  const [socket] = useState(getSocket);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Mutation (auth + connect) is encapsulated in the module helper so the
    // socket instance is never mutated directly inside the component.
    const s = connectSocket(accessToken ?? undefined);

    const onConnect = () => dispatch(setConnected(true));
    const onDisconnect = () => dispatch(setConnected(false));

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      disconnectSocket();
    };
  }, [isAuthenticated, accessToken, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
