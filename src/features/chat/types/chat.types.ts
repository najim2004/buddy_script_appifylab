export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ChatState {
  activeRoomId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  isConnected: boolean;
}

/** Socket event contract shared with the backend. */
export interface ServerToClientEvents {
  "message:new": (message: Message) => void;
  "user:typing": (payload: { roomId: string; userId: string }) => void;
}

export interface ClientToServerEvents {
  "message:send": (payload: { roomId: string; content: string }) => void;
  "room:join": (roomId: string) => void;
  "user:typing": (roomId: string) => void;
}
