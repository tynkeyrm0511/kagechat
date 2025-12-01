import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/messageController.js";
import {
  checkExitstingFriendShip,
  checkGroupMemberShip,
} from "../middlewares/friendMiddleware.js";

const router = express.Router();
router.post("/direct", checkExitstingFriendShip, sendDirectMessage);
router.post("/group", checkGroupMemberShip, sendGroupMessage);

export default router;
