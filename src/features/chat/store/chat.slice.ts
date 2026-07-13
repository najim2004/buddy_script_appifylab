import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatState, Message } from "../types/chat.types";

const initialState: ChatState = {
  activeRoomId: null,
  messages: {},
  typingUsers: {},
  isConnected: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setActiveRoom: (state, action: PayloadAction<string>) => {
      state.activeRoomId = action.payload;
    },
    messageReceived: (state, action: PayloadAction<Message>) => {
      const { room_id } = action.payload;
      state.messages[room_id] ??= [];
      state.messages[room_id].push(action.payload);
    },
    setMessages: (
      state,
      action: PayloadAction<{ room_id: string; messages: Message[] }>,
    ) => {
      state.messages[action.payload.room_id] = action.payload.messages;
    },
  },
});

export const { setConnected, setActiveRoom, messageReceived, setMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
