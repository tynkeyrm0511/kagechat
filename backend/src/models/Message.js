import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    //Conversation chứa message này
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true, //Index để tăng tốc truy vấn
    },
    //Người gửi là ai?
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Nội dung tin nhắn
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    messageType: {
        type: String,
        enum: ['text', 'image'],
        default: 'text'
    },
    imgUrl: {
      type: String,
      default: null,
    },
    imgId: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Index để truy vấn nhanh hơn
messageSchema.index({ conversationId: 1, createdAt: -1 });
const Message = mongoose.model("Message", messageSchema);

export default Message;
