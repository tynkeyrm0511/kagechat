import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/chat";

interface FetchMessageProp {
  messages: Message[];
  cursor?: string;
}
const pageLimit = 50;
export const chatService = {
  async fetchConversations(): Promise<Conversation[]> {
    const res = await api.get("/conversations");
    return res.data.conversations || [];
  },
  async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProp> {
    const res = await api.get(
      `/conversations/${id}/message?limit=${pageLimit}&cursor=${cursor}`
    );
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },
};
