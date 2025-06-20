import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; 
import { getReceiverSocketId ,io} from "../lib/socket.js";


export const getUsersForSidebar= async(req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers);
    }catch(error){
        console.error("Error  in getUsersForSidebar : ", error.message);
        res.status(500).json({message:"Interval Server error"});
    }
};

//To get messages between two different users 
export const getMessages= async(req,res)=>{
    try{
        const {id:userToChatId }= req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}    //Filters all the messages where either I am the sender or the person I am chatting with is the sender
            ]
        }) 
        res.status(200).json(messages);
    }catch(error){
       console.log("Error in getMessages Controller:",error.message) ;
       res.status(500).json({error:"Internal server error"});
    }
}

//To send messages to backend, which can either be a text or image
export const sendMessage=async(req,res)=>{
    try{
        const{text,image} = req.body;
        const{id:receiverId}= req.params;
        const senderId=req.user._id;

        let imageUrl;
        //If user send an image
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image); // Upload image to cloudinary
            imageUrl = uploadResponse.secure_url; //Gets a Url of the image for access
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save(); // Saves newly created message in MongoDB

        //todo: real time functionality using sockit.io : Library to send and recieve messages without refreshing
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage); //Send response to app

    }catch(error){
       console.log("Error in sendMessage Controller:",error.message) ;
       res.status(500).json({error:"Internal server error"});
    }
}