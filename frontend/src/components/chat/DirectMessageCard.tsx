import React from "react";
import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import {cn} from "@/lib/utils"

const DirectMessageCard = ({ conv }: { conv: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConverstionId, setActiveConversation, messages } =
    useChatStore();

  if (!user) return null;

  const otherUser = conv.participants.find((p) => p._id !== user.id);
  if (!otherUser) return null;

  const unreadCount = conv.unreadCounts[user._id];

  const lastMessage = conv.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      // todo: fetch messages for this conversation
    }
  };

  return <ChatCard
    conversationId={conv._id}
    name={otherUser?.displayName ?? ""}
    timestamp={
      conv.lastMessage?.createdAt
        ? new Date(conv.lastMessage.createdAt)
        : undefined
    }
    isActive={activeConverstionId === conv._id}
    onSelect={handleSelectConversation}
    unreadCount={unreadCount}
    leftSection={<>{/* todo: user avatar, status bagde, unread count */}</>}
    subtitle={
      <p
        className={cn(
          "text-sm truncate",
          unreadCount > 0
            ? "font-medium text-foreground"
            : "text-muted-foreground"
        )}
      >
        {lastMessage}
      </p>
    }
  />;
};

export default DirectMessageCard;
