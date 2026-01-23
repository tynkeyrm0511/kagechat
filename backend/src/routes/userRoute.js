import express from "express";
import { authMe, test } from "../controllers/userController.js";
import { searchUserByUserName } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/test", test);
router.get("/search", searchUserByUserName);

export default router;
