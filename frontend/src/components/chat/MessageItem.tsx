import type { Conversation, Message, Participant } from "@/types/chat";
import React from "react";
import { cn, formatMessageTime } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConversation: Conversation;
  lastMessageStatus: "Đã gửi" | "Đã xem";
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  index,
  messages,
  selectedConversation,
  lastMessageStatus,
}) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      5 * 60 * 1000; // 5 minutes

  const isGroupBreak = isShowTime && message.senderId !== prev?.senderId;

  const participant = selectedConversation.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  return (
    <>
      {/* Time */}
      {isShowTime && (
        <span className="flex justify-center text-xs text-muted-foreground px-1 py-2">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* Avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName || "Unknown"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* Messages */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          <Card
            className={cn(
              "p-3",
              message.isOwn
                ? "bg-primary border-0 text-white"
                : "bg-chat-bubble-received ",
            )}
          >
            <p className="text-sm leading-relaxed wrap-break-word">
              {message.content}
            </p>
          </Card>

          {/* Seen or Delivered Status */}
          {message.isOwn &&
            message._id === selectedConversation.lastMessage?._id && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-1.5 py-0.5 h-4 border-0",
                  lastMessageStatus === "Đã xem"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {lastMessageStatus}
              </Badge>
            )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;
