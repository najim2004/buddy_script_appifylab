import { io, type Socket } from "socket.io-client";
import { env } from "@/lib/env";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function connectSocket(token?: string): Socket {
  const s = getSocket();
  if (token) s.auth = { token };
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) socket.disconnect();
}
