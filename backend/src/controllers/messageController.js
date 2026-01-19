import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";
import {
  emitNewMessage,
  updateConversationAfterMessage,
} from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
  try {
    //Lấy dữ liệu từ req.body
    const { recipientId, content, conversationId } = req.body;

    //Lấy userId từ req.user đã được middleware auth gán vào
    const senderId = req.user._id;

    let conversation; //Cuộc trò chuyện hiện tại

    //Kiểm tra dữ liệu
    if (!content) {
      return res.status(400).json({
        message: "Nội dung tin nhắn không được để trống",
      });
    }

    //Tìm cuộc trò chuyện trực tiếp giữa 2 người
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    //Nếu không có cuộc trò chuyện thì tạo mới
    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() }, //Người gửi
          { userId: recipientId, joinedAt: new Date() }, //Người nhận
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    //Tạo tin nhắn mới
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    //Cập nhật cuộc trò chuyện sau khi gửi tin nhắn
    updateConversationAfterMessage(conversation, message, senderId);

    //Lưu cuộc trò chuyện
    await conversation.save();

    //Phát sự kiện tin nhắn mới đến người nhận
    emitNewMessage(io, conversation, message);

    //Trả về phản hồi
    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn trực tiếp", error);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
export const sendGroupMessage = async (req, res) => {
  try {
    //Lấy dữ liệu từ req.body
    const { conversationId, content } = req.body;

    //Lấy userId từ req.user đã được middleware auth gán vào
    const senderId = req.user._id;
    
    //Lấy cuộc trò chuyện từ middleware
    const conversation = req.conversation;

    //Kiểm tra dữ liệu gửi lên
    if (!content) {
      return res.status(400).json({
        message: "Nội dung tin nhắn không được để trống",
      });
    }

    //Tạo tin nhắn mới
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    //Cập nhật cuộc trò chuyện sau khi gửi tin nhắn
    updateConversationAfterMessage(conversation, message, senderId);

    //Lưu cuộc trò chuyện
    await conversation.save();

    //Phát sự kiện tin nhắn mới đến các thành viên trong cuộc trò chuyện
    emitNewMessage(io, conversation, message);

    //Trả về phản hồi
    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn nhóm", error);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
