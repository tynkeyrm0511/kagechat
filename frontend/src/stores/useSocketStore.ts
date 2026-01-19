import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  onlineUsers: [],

  // Connect socket function
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const exsitingSocket = get().socket;

    if (exsitingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Socket đã kết nối:", socket.id);
    });

    // Online users update
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // New message
    socket.on("new-message", ({ message, conversation, unreadCount }) => {
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updateConversation = {
        ...conversation,
        lastMessage,
        unreadCount,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        // todo: mark as read
      }

      useChatStore.getState().updateConversation(updateConversation);
    });
  },

  // Connect socket function
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
