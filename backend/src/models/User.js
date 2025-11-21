import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  displayName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, sparse: true}, //cho phep null, nhung khong duoc trung
  dob: { type: Date },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String }, //link CDN de hien thi hinh anh
  avatarId: { type: String }, //Cloudinary public_id de xoa hinh
  bio: { type: String, maxlength: 500 },

},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
