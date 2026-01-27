import React from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
const FriendSentRequest = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((request) => (
          <FriendRequestItem
            key={request._id}
            requestInfo={request}
            type="sent"
            actions={<p className="text-muted-foreground text-sm">Đang chờ trả lời...</p>}
          />
        ))}
      </>
    </div>
  );
};

export default FriendSentRequest;
