import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";

// Gửi yêu cầu kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body; // ID người nhận
    const from = req.user._id; // ID người gửi
    // Kiểm tra tự gửi yêu cầu kết bạn cho chính mình
    if (from.toString() === to) {
      return res.status(400).json({
        message: "Không thể gửi yêu cầu kết bạn cho chính mình",
      });
    }
    // Kiểm tra người nhận có tồn tại không
    const userExists = await User.exists({ _id: to });
    if (!userExists) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    // Kiểm tra đã là bạn bè hoặc đã có yêu cầu kết bạn tồn tại
    let userA = from.toString();
    let userB = to.toString();
    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }
    const [alreadyFriends, existingFriend] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);
    // Kiểm tra đã là bạn bè
    if (alreadyFriends) {
      return res.status(400).json({
        message: "Hai người đã là bạn bè",
      });
    }
    // Kiểm tra đã có yêu cầu kết bạn tồn tại
    if (existingFriend) {
      return res.status(400).json({
        message: "Đã có yêu cầu kết bạn tồn tại giữa hai người",
      });
    }

    // Tạo yêu cầu kết bạn mới
    const friendRequest = await FriendRequest.create({
      from,
      to,
      message,
    });

    // Trả về phản hồi thành công
    return res.status(201).json({
      message: "Gửi yêu cầu kết bạn thành công",
      friendRequest,
    });
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu kết bạn", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Chấp nhận yêu cầu kết bạn
export const acceptFriendRequest = async (req, res) => {
  try {
    // Lấy ID yêu cầu kết bạn từ tham số URL
    const { requestId } = req.params;
    const userId = req.user._id;

    // Tìm yêu cầu kết bạn xem có tồn tại không
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({
        message: "Yêu cầu kết bạn không tồn tại",
      });
    }
    // Chỉ người nhận mới có thể chấp nhận yêu cầu
    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    // Tạo mối quan hệ bạn bè
    const friend = await Friend.create({
      userA: friendRequest.from,
      userB: friendRequest.to,
    });

    // Xóa yêu cầu kết bạn sau khi chấp nhận
    await FriendRequest.findByIdAndDelete(requestId);

    // Lấy thông tin người gửi yêu cầu kết bạn để trả về cho client
    const from = await User.findById(friendRequest.from)
      .select("_id displayName avatarUrl")
      .lean();

    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "Chấp nhận yêu cầu kết bạn thành công",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Lỗi khi từ chối yêu cầu kết bạn", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    // Lấy ID yêu cầu kết bạn từ tham số URL
    const { requestId } = req.params; // ID yêu cầu kết bạn
    const userId = req.user._id; // ID người dùng hiện tại

    // Tìm yêu cầu kết bạn xem có tồn tại không
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({
        message: "Yêu cầu kết bạn không tồn tại",
      });
    }

    // Chỉ người nhận mới có thể từ chối yêu cầu
    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    // Xóa yêu cầu kết bạn
    await FriendRequest.findByIdAndDelete(requestId);

    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "Từ chối yêu cầu kết bạn thành công",
    });
  } catch (error) {
    console.error("Lỗi khi từ chối yêu cầu kết bạn", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách bạn bè
export const getFriends = async (req, res) => {
  try {
    // Lấy ID người dùng hiện tại
    const userId = req.user._id;
    // Tìm tất cả mối quan hệ bạn bè liên quan đến người dùng
    const friendShips = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean();
    // Nếu không có bạn bè nào
    if (!friendShips.length) {
      return res.status(200).json({
        friends: [],
      });
    }
    // Lấy thông tin bạn bè
    const friends = friendShips.map((fs) => {
      // Trả về người bạn (không phải chính mình)
      if (fs.userA._id.toString() === userId.toString()) {
        return fs.userB;
      } else {
        return fs.userA;
      }
    });
    // Trả về phản hồi thành công
    return res.status(200).json({ friends });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách yêu cầu kết bạn
export const getFriendRequests = async (req, res) => {
  try {
    // Lấy ID người dùng hiện tại
    const userId = req.user._id;

    // Tìm cả yêu cầu kết bạn đã gửi và đã nhận
    const [sent, received] = await Promise.all([
      //Yêu cầu kết bạn đã gửi
      FriendRequest.find({ from: userId }).populate(
        "to",
        "_id displayName avatarUrl"
      ),
      //Yêu cầu kết bạn đã nhận
      FriendRequest.find({ to: userId }).populate(
        "from",
        "_id displayName avatarUrl"
      ),
    ]);

    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "Lấy danh sách yêu cầu kết bạn thành công",
      sent,
      received,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu kết bạn", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
