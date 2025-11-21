import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from './routes/authRoute.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//Middleware
app.use(express.json());

//Public routes
app.use('/api/auth', authRoute)
//Private routes

//Ket noi csdl
connectDB().then(() => {
  //Chay server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}...`);
  });
});