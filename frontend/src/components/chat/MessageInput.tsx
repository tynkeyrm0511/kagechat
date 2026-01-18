import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

interface MessageInputProps {
  selectedConversation: Conversation;
}

const MessageInput = ({ selectedConversation }: MessageInputProps) => {
  const { user } = useAuthStore();
  const [value, setValue] = useState("");
  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue((prev) => prev + emoji);
  };

  // Send Message Function
  const sendMessage = async () => {
    if (!value.trim()) return;
    const currenValue = value;
    setValue("");
    try {
      if (selectedConversation.type === "direct") {
        const participants = selectedConversation.participants;

        const otherUser = participants.filter((p) => p._id !== user._id)[0];

        await sendDirectMessage(otherUser._id, currenValue);
      } else {
        await sendGroupMessage(selectedConversation._id, currenValue);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    }
  };

  // Handle Enter Key Press to Send Message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 min-h-16 bg-background">
      {/* Send IMG Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 transition-smooth"
      >
        <ImagePlus className="size-4" />
      </Button>

      {/* Message Input with Emoji Picker */}
      <div className="flex-1 relative">
        {/* Message Input */}
        <Input
          onKeyDown={handleKeyPress}
          value={value}
          onChange={handleInputChange}
          placeholder="Soạn tin nhắn..."
          className="pr-20 bg-white border-primary/50 focus:border-primary transition-smooth resize-none"
        />

        {/* Emoji Picker */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 hover:bg-primary/10 transition-smooth"
          >
            <div>
              <EmojiPicker onChange={handleEmojiSelect} />
            </div>
          </Button>
        </div>
      </div>

      {/* Send Message Button */}
      <Button
        onClick={sendMessage}
        className="bg-primary hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessageInput;
