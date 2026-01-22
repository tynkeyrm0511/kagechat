import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { act, useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  // Access chat store state
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "Đã gửi" | "Đã xem"
  >("Đã gửi");

  // Get messages for the active conversation
  const messages = allMessages[activeConversationId!]?.items ?? [];

  const reversedMessages = [...messages].reverse();

  // Find the selected conversation based on the activeConversationId
  const selectedConversation = conversations.find(
    (c) => c._id === activeConversationId,
  );

  const key = `chat-scroll-${activeConversationId}`;

  //Ref
  const messageEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = selectedConversation?.lastMessage;
    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConversation?.seenBy || [];

    setLastMessageStatus(seenBy.length > 0 ? "Đã xem" : "Đã gửi");
  }, [selectedConversation]);

  // Scroll to the bottom when messages change
  useLayoutEffect(() => {
    if (!messageEndRef.current) {
      return;
    }

    messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversationId]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    }

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Lỗi khi tải thêm tin nhắn:", error);
    }
  };

  //Handle scroll save
  const handleScrollSave = () => {
    const container = containerRef.current;

    if (!container || !activeConversationId) {
      return;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const item = sessionStorage.getItem(key);
    if (item) {
      const { scrollTop, scrollHeight } = JSON.parse(item);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length]);

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
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
      >
        <div ref={messageEndRef}></div>
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p>Đang tải thêm tin nhắn...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
              key={message._id}
              message={message}
              index={index}
              messages={reversedMessages}
              selectedConversation={selectedConversation}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;
