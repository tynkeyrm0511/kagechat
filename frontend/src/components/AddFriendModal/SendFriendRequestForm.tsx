import React from "react";
import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus2 } from "lucide-react";

interface SendFriendRequestFormProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchedUsername: string;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const SendFriendRequestForm: React.FC<SendFriendRequestFormProps> = ({
  register,
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <span className="text-sm text-emerald-500">
          Tìm thấy <span className="font-semibold">{searchedUsername}</span>
        </span>

        <div>
          <Label htmlFor="message" className="text-sm font-semibold">
            Gửi lời mời kết bạn kèm tin nhắn (tùy chọn)
          </Label>
          <Textarea
            id="message"
            rows={3}
            placeholder="Chào bạn! Chúng ta có thể trở thành bạn bè được không?"
            className="glass border-border/50 focus:border-primary/50 transition-smooth resize-none"
            {...register("message")}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="flex-1 glass hover:text-destructive"
            onClick={onBack}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-opacity-90  transition-smooth"
            disabled={loading}
          >
            {loading ? (
              "Đang gửi..."
            ) : (
              <>
                <UserPlus2 className="size-5 mr-2" /> Kết bạn
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};
export default SendFriendRequestForm;
