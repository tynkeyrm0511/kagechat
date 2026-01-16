import { useThemeStore } from "@/stores/useThemeStore";
import { Popover, PopoverContent } from "@radix-ui/react-popover";
import Emoji, { Theme, EmojiStyle } from "emoji-picker-react";
import { PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
interface EmojiPickerProps {
  onChange: (value: string) => void;
}
const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();
  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="p-0">
        <Emoji
          onEmojiClick={(emojiData) => onChange(emojiData.emoji)}
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          emojiStyle={EmojiStyle.NATIVE}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
