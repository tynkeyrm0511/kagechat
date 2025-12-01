import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCRESS_TOKEN_TTL = "15m"; // thuong thi access token duoi 15 phut
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngay

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Khong the thieu username, password, email, firstName, lastName",
      });
    }

    //Kiem tra user da ton tai chua?
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Thong tin dang nhap khong chinh xac" });
    }

    //Kiem tra email da ton tai chua?
    const emailExists = await User.findOne({email})
    if(emailExists){
      return res.status(409).json({
        message: "Email da duoc su dung"
      })
    }
    //Ma hoa password
    const passwordHash = await bcrypt.hash(password, 10); //salt = 10
    //Tao user moi
    await User.create({
      username,
      passwordHash,
      email,
      displayName: `${firstName} ${lastName}`,
    });
    //Return
    return res.sendStatus(204);
  } catch (error) {
    console.error("Loi khi goi signUp", error);
    return res.status(500).json({ message: "Loi server" });
  }
};

export const signIn = async (req, res) => {
  try {
    //Lay input reqbody
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thieu username hoac password" });
    }
    //Lay hashpassword trong db so sanh voi input
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Thong tin dang nhap khong chinh xac" });
    }
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Thong tin dang nhap khong chinh xac" });
    }
    //Tao access token voi JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCRESS_TOKEN_TTL }
    );
    //Tao refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    //Tao session moi de luu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    //Tra refresh token ve trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // khong cho phep truy cap bang js
      secure: true, // chi truy cap bang https
      sameSite: "none", // de fe va be deploy doc lap
      maxAge: REFRESH_TOKEN_TTL
    });
    //Tra accress token ve trong res
    return res.status(200).json({
      message: `Nguoi dung ${user.displayName} da dang nhap!`,
      accessToken,
    });
  } catch (error) {
    console.error("Loi khi goi signIn", error);
    return res.status(500).json({ message: "Loi server" });
  }
};

export const signOut = async (req, res) => {
  try {
    //Lay refresh token tu cookie cua nguoi dung
    const token = req.cookies?.refreshToken;
    if (token) {
      //Xoa refresh token trong session(database)
      await Session.deleteOne({ refreshToken: token });
      //Xoa cookie
      res.clearCookie("refreshToken");
      return res.status(200).json({message: "Dang xuat thanh cong"})
    }
    //Tra ve status 204 -> Dang xuat thanh cong
    return res.sendStatus(204);
  } catch (error) {
    console.error("Loi khi goi signOut", error);
    return res.status(500).json({ message: "Loi server" });
  }
};

//Tạo access token mới từ refresh token
export const refreshToken = async (req,res) => {
  try {
    // Lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if(!token){
      return res.status(401).json({message:"Refresh Token không tồn tại"});
    }
    //So sánh refresh token từ cookie với refresh token trong database
    const session = await Session.findOne({refreshToken: token});
    if(!session){
      return res.status(401).json({message: "Token không hợp lệ hoặc đã hết hạn"});
    }
    //Kiểm tra token hết hạn chưa?
    if(session.expiresAt < new Date()){
      return res.status(401).json({message: "Token đã hết hạn"});
    }
    //Nếu hết hạn tạo accesstoken mới
    const accessToken = jwt.sign({
      userId: session.userId
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCRESS_TOKEN_TTL});
    //Trả access token mới -> return
    return res.status(200).json({accessToken});
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken từ API",error);
    return res.status(500).json({message:"Lỗi server"})
  }
}
