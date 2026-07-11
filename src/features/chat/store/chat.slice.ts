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
      const { roomId } = action.payload;
      state.messages[roomId] ??= [];
      state.messages[roomId].push(action.payload);
    },
    setMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: Message[] }>,
    ) => {
      state.messages[action.payload.roomId] = action.payload.messages;
    },
  },
});

export const { setConnected, setActiveRoom, messageReceived, setMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
