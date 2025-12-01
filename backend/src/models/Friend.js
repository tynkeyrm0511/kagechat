import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    // Hai người trong mối quan hệ bạn bè
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

friendSchema.pre("save", async function (next) {
  // Đảm bảo thứ tự userA < userB để tránh trùng lặp
  const a = this.userA.toString();
  const b = this.userB.toString();
  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }

  if (typeof next === 'function') {
    next();
  }
});

// Đảm bảo không có quan hệ trùng lặp
friendSchema.index({ userA: 1, userB: 1 }, { unique: true });

// Tạo model
const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
