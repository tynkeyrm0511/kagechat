import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    // Người gửi lời mời
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Người nhận lời mời
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Tin nhắn kèm theo (nếu có)
    message: {
        type: String,
        maxlength: 300,
    }
},{
    timestamps: true,
});

friendRequestSchema.index({from: 1, to: 1}, {unique: true}); // Đảm bảo không gửi trùng lời mời
friendRequestSchema.index({from: 1}); // Tìm lời mời đã gửi
friendRequestSchema.index({to: 1}); // Tìm lời mời đã nhận

const FriendRequest = mongoose.model("FriendRequest",friendRequestSchema);
export default FriendRequest;