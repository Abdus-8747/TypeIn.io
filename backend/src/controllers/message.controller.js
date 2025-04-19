import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select("-password")
        
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ error: "Internal Server error"})
    }
}

export const getMessages = async(req,res) => {
    try {
        const { id:userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId},
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal Server error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        
        // Validate that there is either text or image
        if (!text.trim() && !image) {
            return res.status(400).json({ error: "Message content is required" });
        }

        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;

        // If there's an image, upload it to Cloudinary
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url; // Set the image URL
            } catch (uploadError) {
                console.log("Error uploading image to Cloudinary:", uploadError.message);
                return res.status(500).json({ error: "Image upload failed" });
            }
        }

        // Create a new message (with or without an image)
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, // Save imageUrl if it exists, otherwise null
        });

        //console.log("New message to save:", newMessage);

        await newMessage.save();

        const recieverSocketId = getRecieverSocketId(receiverId)
        if(recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage); // Return the newly created message
    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};
