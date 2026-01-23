import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus2 } from "lucide-react";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchForm from "../AddFriendModal/SearchForm";
import SendFriendRequestForm from "../AddFriendModal/SendFriendRequestForm";

export interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = React.useState<boolean | null>(null);
  const [searchUser, setSearchUser] = React.useState<User>();
  const [searchedUsername, setSearchedUsername] = React.useState<string>("");
  const { loading, searchByUserName, addFriend } = useFriendStore() || {
    loading: false,
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      username: "",
      message: "",
    },
  });

  const usernameValue = watch("username");

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();

    if (!username) return;

    setIsFound(null);

    setSearchedUsername(username);

    try {
      if (!searchByUserName) return;

      const foundUser = await searchByUserName(username);

      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      if (!addFriend) return;

      const message = await addFriend(searchUser._id, data.message.trim());

      toast.success(message || "Đã gửi lời mời kết bạn!");

      handleCancel();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername("");
    setIsFound(null);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex justify-center items-center size-6 rounded hover:bg-sidebar-accent cursor-pointer z-10 border-none bg-transparent outline-none">
          <UserPlus2 className="size-5" />
          <span className="sr-only">Thêm bạn</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center">
            Thêm bạn
          </DialogTitle>
        </DialogHeader>
        {!isFound && (
          <SearchForm
            register={register}
            errors={errors}
            usernameValue={usernameValue}
            loading={!!loading}
            isFound={isFound}
            searchedUsername={searchedUsername}
            onSubmit={handleSearch}
            onCancel={handleCancel}
          />
        )}
        {isFound && (
          <SendFriendRequestForm
            register={register}
            loading={!!loading}
            searchedUsername={searchedUsername}
            onSubmit={handleSend}
            onBack={() => {
              setIsFound(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
