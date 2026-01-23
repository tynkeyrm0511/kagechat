import User from "../models/User.js";
export const authMe = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: `Lay thong tin thanh cong`, user: req.user });
  } catch (error) {
    console.error(`Loi khi lay thong tin user`, user);
    return res.status(500).json({
      message: "Loi server",
    });
  }
};

export const test = async (req, res) => {
  return res.sendStatus(204);
};

export const searchUserByUserName = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      return res.status(400).json({
        message: "Can't search for empty username",
      });
    }

    const user = await User.findOne({ username }).select(
      "_id displayName username avatarUrl",
    );

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    console.error("Error searching for user by username", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
