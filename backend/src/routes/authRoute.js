import express from 'express';
import {signUp, signIn} from '../controllers/authController.js';

const router = express.Router();

//Dang ky - POST
router.post("/signup", signUp)
//Dang nhap - POST
router.post("/signin", signIn)
export default router;