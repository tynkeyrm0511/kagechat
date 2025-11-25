import express from 'express';
import {signUp, signIn, signOut, refreshToken} from '../controllers/authController.js';

const router = express.Router();

//Dang ky - POST    
router.post("/signup", signUp)
//Dang nhap - POST
router.post("/signin", signIn)
//Dang xuat - POST
router.post('/signout', signOut)
//Refresh
router.post('/refresh', refreshToken);
export default router;