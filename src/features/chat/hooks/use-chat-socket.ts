"use client";

import { useEffect } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { useAppDispatch } from "@/store/hooks";
import { messageReceived, setActiveRoom } from "../store/chat.slice";
import type { Message } from "../types/chat.types";

export function useChatSocket(roomId: string) {
  const socket = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    dispatch(setActiveRoom(roomId));
    socket.emit("room:join", roomId);

    const onNewMessage = (message: Message) => {
      dispatch(messageReceived(message));
    };

    socket.on("message:new", onNewMessage);
    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [socket, roomId, dispatch]);

  const sendMessage = (content: string) => {
    socket?.emit("message:send", { room_id: roomId, content });
  };

  return { sendMessage };
}
