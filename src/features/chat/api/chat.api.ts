import { apiSlice } from "@/lib/api/api-slice";
import type { Message } from "../types/chat.types";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], string>({
      query: (roomId) => `/chat/rooms/${roomId}/messages`,
      providesTags: (_result, _err, roomId) => [
        { type: "Message", id: roomId },
      ],
    }),
  }),
});

export const { useGetMessagesQuery } = chatApi;
