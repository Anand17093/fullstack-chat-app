import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import {app,server} from "./lib/socket.js";

dotenv.config();
// const app = express(); //Start the web server
const PORT = process.env.PORT //Pick the port number from env
// const __dirname = path.resolve();


app.use((req, res, next) => {
  console.log("🚨 Incoming request path:", req.path);
  next();
});


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({limit:'10mb'})); // Allows your app to read incoming data in JSON format (used in APIs)
app.use(cookieParser()); // Lets your app understand cookies sent by users



app.use("/api/auth",authRoutes); // Routes related to authentication: login, signup, logout
app.use("/api/messages",messageRoutes); // Routes related to sending or receiving messages
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
     
  })
   
}
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Express Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});


server.listen(PORT,()=>{
    console.log("Server is running");
    connectDB();
});