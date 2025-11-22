import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Authorization - xac minh user la ai?
export const protectedRoute = async (req, res, next) => {
  try {
    //Lay token tu authorization header
    const authHeader = req.headers.authorization;
    //Kiem tra co header va bat dau bang Bearer hay khong?
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: `Khong tim thay access token`,
      });
    }
    //Tach lay access token va bo chu 'Bearer'
    const token = authHeader.split(" ")[1]; // 0 = Bearer, 1 = access token

    //Xac minh token hop le hay khong?
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //Tim user
    const user = await User.findById(decoded.userId).select("-passwordHash"); //Tra ve thong tin nguoi dung tru MAT KHAU
    //Kiem tra user co ton tai hay khong?
    if (!user) {
      return res.status(401).json({
        message: `Nguoi dung khong ton tai`,
      });
    }
    //Gan thong tun user vao req cho cac route tiep theo co the dung req.user
    req.user = user;
    next();
  } catch (error) {
    console.error("Loi khi xac minh JWT", error);

    if (error.name == "JsonWebTokenError") {
      return res.status(401).json({
        message: `Token khong hop le`,
      });
    }
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({
        message: `Token da het han, vui long dang nhap lai`,
      });
    }
    //Loi khac (database, server...)
    return res.status(500).json({
      message: `Loi server`,
    });
  }
};
