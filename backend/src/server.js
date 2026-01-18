import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import { app, server } from "./socket/index.js";

const PORT = process.env.PORT || 5001; //Port server

//Middleware
app.use(express.json()); //Body parser
app.use(cookieParser()); //Cookie parser
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); //CORS
//Public routes
app.use("/api/auth", authRoute); //Authentication
//Private routes
app.use(protectedRoute); //Authorization
app.use("/api/users", userRoute); //Profile
app.use("/api/friends", friendRoute); //Friend
app.use("/api/messages", messageRoute); //Message
app.use("/api/conversations", conversationRoute); //Conversation

//Ket noi DB va chay server
connectDB().then(() => {
  //Start server
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}...`);
  });
});
