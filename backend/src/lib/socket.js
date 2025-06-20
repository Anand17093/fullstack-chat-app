import {Server} from "socket.io";
import http from "http";
import express from "express";
const app= express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin : ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//To store online users
// userId as key and socketId as value
const userSocketMap = {
    
}
io.on("connection",(socket)=>{
    console.log("A user has connnected",socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
       userSocketMap[userId]= socket.id; 
    }
    //If a user is online it tells to every other users
    io.emit("getOnlineUsers",Object.keys(userSocketMap)) ; //Used to send events to all connected clients


socket.on("disconnect",()=>{
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
});
});
export {io,app,server};