import type { FriendRequest } from "@/types/user";
import type { FC } from "react";
import UserAvatar from "../chat/UserAvatar";

interface FriendRequestItemProps {
  requestInfo: FriendRequest;
  actions: React.ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem: FC<FriendRequestItemProps> = ({
  requestInfo,
  actions,
  type,
}) => {
  if (!requestInfo) {
    return;
  }

  const info = type === "sent" ? requestInfo.to : requestInfo.from;

  if (!info) {
    return;
  }

  return (
    <div className="flex items-center justify-between rounded-lg shadow-md border border-primary-foreground p-3">
      <div className="flex items-center gap-3">
        <UserAvatar type="sidebar" name={info.displayName} />
        <div>
          <p className="font-medium ">{info.displayName}</p>
          <p className="text-sm text-muted-foreground">@{info.username}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{actions}</div>
    </div>
  );
};

export default FriendRequestItem;
