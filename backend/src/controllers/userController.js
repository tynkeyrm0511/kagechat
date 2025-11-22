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
