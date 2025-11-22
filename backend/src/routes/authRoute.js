import express from 'express';
import {signUp, signIn, signOut} from '../controllers/authController.js';

const router = express.Router();

//Dang ky - POST
router.post("/signup", signUp)
//Dang nhap - POST
router.post("/signin", signIn)
//Dang xuat - POST
router.post('/signout', signOut)
export default router;