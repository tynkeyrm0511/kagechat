import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Apply middleware to Socket.IO
io.use(socketMiddleware);

// Map to track online users
const onlineUsers = new Map(); // {userId: socketId} Redis can be used in future for scalability

// Handle Socket.IO connections
io.on("connection", async (socket) => {
  // When a user connects
  const user = socket.user;
  console.log(`${user.displayName} online with socket ${socket.id}`);
  onlineUsers.set(user._id, socket.id);
  io.emit("online-users", Array.from(onlineUsers.keys()));

  // User join their conversation rooms
  const conversationIds = await getUserConversationsForSocketIO(user._id);
  conversationIds.forEach((id) => {
    socket.join(id);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export { io, app, server };
