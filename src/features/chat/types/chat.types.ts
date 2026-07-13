export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

export interface ChatState {
  activeRoomId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  isConnected: boolean;
}

export interface ServerToClientEvents {
  "message:new": (message: Message) => void;
  "user:typing": (payload: { room_id: string; user_id: string }) => void;
}

export interface ClientToServerEvents {
  "message:send": (payload: { room_id: string; content: string }) => void;
  "room:join": (room_id: string) => void;
  "user:typing": (room_id: string) => void;
}
