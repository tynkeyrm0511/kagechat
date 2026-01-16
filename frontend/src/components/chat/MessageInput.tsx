import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";

const MessageInput = ({
  selectedConversation,
}: {
  selectedConversation: Conversation;
}) => {
  const { user } = useAuthStore();

  const [value, setValue] = useState("");

  if (!user) return;

  return (
    <div className="flex items-center gap-2 p-3 min-h-16 bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 transition-smooth"
      >
        <ImagePlus className="size-4" />
      </Button>
      <div className="flex-1 relative">
        {/* Input */}
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Soạn tin nhắn..."
          className="pr-20 bg-white border-primary/50 focus:border-primary transition-smooth resize-none"
        ></Input>

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 hover:bg-primary/10 transition-smooth"
          >
            <div>
              <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)}/>
            </div>
          </Button>
        </div>
      </div>

      {/* Send Button */}
      <Button
        className="bg-primary hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessageInput;
