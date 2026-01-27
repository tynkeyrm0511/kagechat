import type { FriendRequest, User } from "./user";
import type { Conversation, Message } from "./chat";
import { Socket } from "socket.io-client";

// Auth State
export interface AuthState {
  accessToken: string | null;

  user: User | null;

  loading: boolean;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;

  clearState: () => void;

  fetchMe: () => Promise<void>;

  refresh: () => Promise<void>;

  setAccessToken: (accessToken: string) => void;
}

// Theme State
export interface ThemeState {
  isDark: boolean;

  toggleTheme: () => void;

  setTheme: (dark: boolean) => void;
}

// Chat State
export interface ChatState {
  conversations: Conversation[];

  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor: string | null;
    }
  >;

  activeConversationId: string | null;

  convoLoading: boolean;

  messageLoading: boolean;

  reset: () => void;

  setActiveConversationId: (id: string | null) => void;

  fetchConversations: () => Promise<void>;

  fetchMessages: (conversationId?: string) => Promise<void>;

  //Send direct message functions
  sendDirectMessage: (
    recipientId: string,
    content: string,
    imgUrl?: string,
    conversationId?: string,
  ) => Promise<void>;

  //Send group message function
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;

  // Add message
  addMessage: (message: Message) => void;

  // Update conversation
  updateConversation: (conversation: unknown) => void;

  // Mark conversation as seen
  markAsSeen: () => Promise<void>;
}

// Socket State
export interface SocketState {
  socket: Socket | null;

  onlineUsers: string[];

  connectSocket: () => void;

  disconnectSocket: () => void;
}

// Friend State
export interface FriendState {
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchByUserName: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequests: () => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
}

