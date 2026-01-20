import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

export const createConversation = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { type, name, memberIds } = req.body; // Loại cuộc trò chuyện: "private" hoặc "group"

    const userId = req.user._id; // ID người dùng hiện tại

    // Kiểm tra dữ liệu đầu vào
    if (
      !type || // Loại cuộc trò chuyện là bắt buộc
      (type === "group" && !name) || // Tên nhóm là bắt buộc nếu là cuộc trò chuyện nhóm
      !memberIds || // Danh sách thành viên là bắt buộc
      !Array.isArray(memberIds) || // Kiểm tra xem memberIds có phải là mảng hay không
      memberIds.length === 0 // Danh sách thành viên không được rỗng
    ) {
      return res.status(400).json({
        message:
          "Tên nhóm, loại cuộc trò chuyện và danh sách thành viên là bắt buộc",
      });
    }

    let conversation;
    // Xử lý tạo cuộc trò chuyện dựa trên loại

    if (type === "direct") {
      // Tạo cuộc trò chuyện riêng tư giữa hai người
      const participantId = memberIds[0];

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });

      // Nếu cuộc trò chuyện chưa tồn tại, tạo mới
      if (!conversation) {
        // Tạo cuộc trò chuyện mới
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessage: new Date(),
        });

        await conversation.save(); // Lưu cuộc trò chuyện vào cơ sở dữ liệu
      }
    }

    // Tạo cuộc trò chuyện nhóm nếu loại là "group"
    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))], // Thêm người tạo nhóm và các thành viên khác
        group: {
          name, // Tên nhóm
          createdBy: userId, // Người tạo nhóm
          lastMessage: new Date(), // Thời gian của tin nhắn cuối cùng trong nhóm
        },
      });

      await conversation.save(); // Lưu cuộc trò chuyện nhóm vào cơ sở dữ liệu
    }

    // Kiểm tra nếu cuộc trò chuyện không được tạo thành công
    if (!conversation) {
      return res.status(400).json({
        message: "Conversation type không hợp lệ",
      });
    }

    // Truy vấn để lấy thông tin chi tiết của cuộc trò chuyện vừa tạo
    await conversation.populate([
      // Thông tin người tham gia
      { path: "participants.userId", select: "displayName avatarUrl" },

      // Thông tin những người đã xem tin nhắn
      { path: "seenBy", select: "displayName avatarUrl" },

      // Thông tin tin nhắn cuối cùng
      { path: "lastMessage", select: "displayName avatarUrl" },
    ]);

    // Trả về phản hồi với thông tin cuộc trò chuyện mới tạo
    return res.status(201).json({ conversation });
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    // Lấy ID người dùng từ yêu cầu
    const userId = req.user._id;

    // Tìm tất cả các cuộc trò chuyện mà người dùng tham gia
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessage: -1 }) // Sắp xếp theo tin nhắn cuối cùng giảm dần
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      }) // Thông tin người tham gia
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      }) // Thông tin người gửi tin nhắn cuối cùng
      .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
      }); // Thông tin những người đã xem tin nhắn

    // Định dạng lại dữ liệu cuộc trò chuyện để trả về
    const formatted = conversations.map((conv) => {
      const participants = (conv.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));
      return {
        ...conv.toObject(),
        unreadCounts: conv.unreadCounts || {},
        participants,
      };
    });

    // Trả về phản hồi với danh sách cuộc trò chuyện đã định dạng
    return res.status(200).json({
      conversations: formatted,
    });
  } catch (error) {
    console.error("Lỗi khi lấy cuộc trò chuyện:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    // Lấy ID cuộc trò chuyện từ tham số URL
    const { conversationId } = req.params;

    // Thiết lập giới hạn và con trỏ phân trang
    const { limit = 50, cursor } = req.query;

    // Tạo truy vấn để tìm tin nhắn trong cuộc trò chuyện
    const query = { conversationId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Tìm tin nhắn dựa trên truy vấn, sắp xếp và giới hạn kết quả
    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);

    // Xử lý phân trang và định dạng kết quả
    let nextCursor = null;

    // Kiểm tra nếu có nhiều tin nhắn hơn giới hạn
    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    // Đảo ngược thứ tự tin nhắn để trả về đúng thứ tự thời gian
    messages = messages.reverse();

    // Trả về phản hồi với danh sách tin nhắn và con trỏ phân trang
    return res.status(200).json({ messages, nextCursor });
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find(
      {
        "participants.userId": userId,
      },
      { _id: 1 },
    );

    return conversations.map((conv) => conv._id.toString());
  } catch (error) {
    console.error("Lỗi khi lấy conversation cho Socket.IO:", error);
    return [];
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
    }

    const last = conversation.lastMessage;
    if (!last) {
      return res.status(200).json({ message: "Không có tin nhắn để đánh dấu" });
    }

    if (last.senderId.toString() === userId) {
      return res
        .status(200)
        .json({ message: "Người gửi không cần đánh dấu đã xem" });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      {
        new: true,
      },
    )
      .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      });

    io.to(conversationId).emit("read-message", {
      conversation: updated,
      lastMessage: updated.lastMessage,
    });

    return res.status(200).json({
      message: "Đã đánh dấu đã xem tin nhắn",
      seenBy: updated.seenBy || [],
      myUnreadCount: updated?.unreadCounts.get(userId) || 0,
    });
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã xem tin nhắn:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
