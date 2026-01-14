import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import ChatWindowHeader from "./ChatWindowHeader";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";

const ChatWindowLayout = () => {
  const {
    activeConversationId,
    conversations,
    messageLoading: loading,
    messages,
  } = useChatStore();

  const selectedConversation =
    conversations.find((conv) => conv._id === activeConversationId) ?? null;

  if (!selectedConversation) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounde-sm shadow-sm">
      {/* Header: avatar + name */}
      <ChatWindowHeader />
      {/* Body: Messages */}
      <div className="flex-1 overflow-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>
      {/* Footer: input */}
      <MessageInput />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
