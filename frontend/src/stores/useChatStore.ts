import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatState } from "@/types/store";
import { chatService } from "@/services/chatService";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false, //conversation loading
      messageLoading: false, //message loading

      setActiveConversationId: (id) => set({ activeConversationId: id }),

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },

      fetchConversations: async () => {
        set({ convoLoading: true });
        try {
          const conversations = await chatService.fetchConversations();
          set({ conversations });
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
        } finally {
          set({ convoLoading: false });
        }
      },

      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();
        const convoId = conversationId ?? activeConversationId;
        if (!convoId) return;
        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;
        if (nextCursor === null) return; // No more messages to fetch
        set({ messageLoading: true });
        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );
          const processed = fetched.map((msg) => ({
            ...msg,
            isOwn: msg.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchMessages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();

          await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
          );

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp:", error);
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imgUrl);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === conversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi tin nhắn nhóm:", error);
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const conversationId = message.conversationId;

          let prevItems = get().messages[conversationId]?.items || [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[conversationId]?.items || [];
          }

          set((state) => {
            if (prevItems.some((msg) => msg._id === message._id)) {
              return state;
            }
            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[conversationId].hasMore,
                  nextCursor:
                    state.messages[conversationId].nextCursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi thêm tin nhắn:", error);
        }
      },

      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);
