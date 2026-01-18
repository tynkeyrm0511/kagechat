import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/chat";

interface FetchMessageProp {
  messages: Message[];
  cursor?: string;
}
const pageLimit = 50;
export const chatService = {
  // Fetch all conversations for the user
  async fetchConversations(): Promise<Conversation[]> {
    const res = await api.get("/conversations");
    return res.data.conversations || [];
  },

  // Fetch messages for a specific conversation with pagination
  async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProp> {
    const res = await api.get(
      `/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`,
    );
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  // Send a direct message to a user
  async sendDirectMessage(
    recipientId: string,
    content: string = "",
    imgUrl?: string,
    conversationId?: string,
  ) {
    const res = await api.post("/messages/direct", {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });
    return res.data.message;
  },

  // Send a message to a group conversation
  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imgUrl?: string,
  ) {
    const res = await api.post("/messages/group", {
      conversationId,
      content,
      imgUrl,
    });
    return res.data.message;
  },
};
