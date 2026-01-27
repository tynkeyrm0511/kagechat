import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";

const FriendReceivedRequest = () => {
  const { loading, receivedList, acceptFriendRequest, declineFriendRequest } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Bạn chưa nhận lời mời kết bạn nào
      </div>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời kết bạn", error);
    }
  };
  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời kết bạn", error);
    }
  };
  return (
    <div className="space-y-3 mt-4">
      <>
        {receivedList.map((request) => (
          <FriendRequestItem
            key={request._id}
            requestInfo={request}
            type="received"
            actions={
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAccept(request._id)}
                  size="sm"
                  variant="primary"
                  disabled={loading}
                >
                  Chấp nhận
                </Button>
                <Button onClick={() => handleDecline(request._id)} size="sm" disabled={loading}>
                  Từ chối
                </Button>
              </div>
            }
          />
        ))}
      </>
    </div>
  );
};

export default FriendReceivedRequest;
