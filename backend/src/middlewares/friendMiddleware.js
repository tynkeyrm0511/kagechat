import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

// Hàm để sắp xếp cặp ID người dùng
const pair = (a, b) => {
  return a < b ? [a, b] : [b, a];
};

// Middleware kiểm tra xem đã tồn tại mối quan hệ bạn bè hay chưa
export const checkExitstingFriendShip = async (req, res, next) => {
  try {
    // Lấy userId từ request (giả sử bạn đã có middleware xác thực người dùng)
    const me = req.user._id.toString();
    // Lấy recipientId từ body của request
    const recipientId = req.body?.recipientId ?? null;
    // Lấy memberIds từ body của request (dành cho group chat)
    const memberIds = req.body?.memberIds ?? [];

    // Kiểm tra nếu recipientId không được cung cấp
    if (!recipientId && memberIds.length === 0) {
      return res.status(400).json({
        message: "Chưa cung cấp recipientId hoặc memberIds",
      });
    }
    // Sắp xếp cặp ID người dùng
    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      // Kiểm tra trong cơ sở dữ liệu xem đã tồn tại mối quan hệ bạn bè chưa
      const isFriend = await Friend.findOne({ user1: userA, user2: userB });
      if (!isFriend) {
        return res.status(404).json({
          message: "Chưa có mối quan hệ bạn bè giữa hai người dùng này",
        });
      }
      // Nếu đã là bạn bè, tiếp tục đến middleware tiếp theo
      return next();
    }
    const friendChecks = memberIds.map(async (memberIds) => {
      const [userA, userB] = pair(me, memberIds);
      const isFriend = await Friend.findOne({
        userA,
        userB,
      });
      return isFriend ? null : memberIds;
    });
    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);
    if (notFriends.length > 0) {
      return res.status(403).json({
        message: `Bạn không thể tạo nhóm với những người dùng sau vì họ không phải là bạn bè của bạn: ${notFriends.join(
          ", "
        )}`,
      });
    }
    next();
  } catch (error) {
    console.error("Lỗi kiểm tra mối quan hệ bạn bè:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ khi kiểm tra mối quan hệ bạn bè",
    });
  }
};

export const checkGroupMemberShip = async (req, res, next) => {
  try {
    // Lấy conversationId từ body và userId từ req.user
    const { conversationId } = req.body;
    // Lấy conversationId từ body và userId từ req.user
    const userId = req.user._id;

    // Tìm cuộc trò chuyện trong cơ sở dữ liệu
    const conversation = await Conversation.findById(conversationId);

    // Kiểm tra nếu cuộc trò chuyện không tồn tại
    if (!conversation) {
      return res.status(404).json({
        message: "Cuộc trò chuyện không tồn tại",
      });
    }

    // Kiểm tra nếu userId không phải là thành viên của cuộc trò chuyện
    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    // Nếu không phải thành viên, trả về lỗi 403 Forbidden
    if (!isMember) {
      return res.status(403).json({
        message: "Bạn không phải là thành viên của cuộc trò chuyện này",
      });
    }
    // Nếu là thành viên, gán cuộc trò chuyện vào req để sử dụng trong controller
    req.conversation = conversation;
    // Tiếp tục đến middleware hoặc controller tiếp theo
    next();
  } catch (error) {
    console.error("Lỗi kiểm tra thành viên nhóm:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ khi kiểm tra thành viên nhóm",
    });
  }
};
