import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useEffect, useState } from "react";
const ChatWindowBody = () => {
  // Access chat store state
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "Đã gửi" | "Đã xem"
  >("Đã gửi");

  // Get messages for the active conversation
  const messages = allMessages[activeConversationId!]?.items ?? [];

  // Find the selected conversation based on the activeConversationId
  const selectedConversation = conversations.find(
    (c) => c._id === activeConversationId,
  );

  useEffect(() => {
    const lastMessage = selectedConversation?.lastMessage;
    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConversation?.seenBy || [];

    setLastMessageStatus(seenBy.length > 0 ? "Đã xem" : "Đã gửi");
  }, [selectedConversation]);

  // If no conversation is selected, show the welcome screen
  if (!selectedConversation) {
    return <ChatWelcomeScreen />;
  }

  // If the selected conversation has no messages, show a placeholder
  if (!messages?.length) {
    return (
      <div className="flex items-center h-full justify-center text-muted-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );
  }

  // Render the chat messages
  return (
    <div className="bg-primary-foreground flex flex-col h-full overflow-hidden p-4">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id}
            message={message}
            index={index}
            messages={messages}
            selectedConversation={selectedConversation}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
