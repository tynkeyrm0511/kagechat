import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//Middleware
app.use(express.json());
app.use(cookieParser());
//Public routes
app.use("/api/auth", authRoute);
//Private routes
app.use(protectedRoute); //Authorization
app.use("/api/users", userRoute);
//Ket noi csdl
connectDB().then(() => {
  //Chay server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}...`);
  });
});
