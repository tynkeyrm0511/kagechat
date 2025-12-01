export const updateConversationAfterMessage = (
  conversation,
  message,
  senderId
) => {
  //Cập nhật thông tin cuộc trò chuyện
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId: senderId,
      createdAt: message.createdAt,
    },
  });

  //Xử lý số tin nhắn chưa đọc của từng người
  conversation.participants.forEach((p) => {
    // Lấy memberId từ participant hiện tại
    const memberId = p.userId.toString();

    // Kiểm tra nếu memberId trùng với senderId thì không tăng số tin nhắn chưa đọc
    const isSender = memberId === senderId.toString(); // So sánh dưới dạng chuỗi để tránh lỗi ObjectId
    const prevCount = conversation.unreadCounts.get(memberId) || 0; // Lấy số tin nhắn chưa đọc hiện tại hoặc 0 nếu chưa có
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1); // Cập nhật số tin nhắn chưa đọc
  });
};
