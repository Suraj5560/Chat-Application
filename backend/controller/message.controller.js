import messageModel from '../model/message.model.js';
import userModel from '../model/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import { io, userSocketMap } from '../app.js';


const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all messages where current user is sender or receiver AND not deleted by them
        const messages = await messageModel.find({
            $or: [{ senderId: userId }, { recevierId: userId }],
            deletedBy: { $ne: userId }
        }).select('senderId recevierId');

        // 2. Extract unique user IDs from those messages + pinned chats
        const uniqueUserIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() !== userId.toString()) {
                uniqueUserIds.add(msg.senderId.toString());
            }
            if (msg.recevierId.toString() !== userId.toString()) {
                uniqueUserIds.add(msg.recevierId.toString());
            }
        });
        
        // Also always include pinned users so they don't disappear
        const pinnedChats = req.user.pinnedChats || [];
        pinnedChats.forEach(id => uniqueUserIds.add(id.toString()));

        // 3. Fetch user details for those unique IDs
        let filterUser = await userModel.find({ _id: { $in: Array.from(uniqueUserIds) } }).select('-password').lean();

        // 4. Attach isPinned status and sort (pinned first)
        filterUser = filterUser.map(user => ({
            ...user,
            isPinned: pinnedChats.some(pinnedId => pinnedId.toString() === user._id.toString())
        }));
        
        filterUser.sort((a, b) => (b.isPinned === a.isPinned) ? 0 : b.isPinned ? 1 : -1);

        // Count number of unseen messages (ignoring deleted ones)
        const unseenmessages = {};
        const promises = filterUser.map(async (user) => {
            const unreadMessages = await messageModel.find({ 
                senderId: user._id, 
                recevierId: userId, 
                seen: false,
                deletedBy: { $ne: userId }
            });
            if (unreadMessages.length > 0) {
                unseenmessages[user._id] = unreadMessages.length;
            }
        });

        await Promise.all(promises);
        res.json({
            success: true,
            users: filterUser,
            unseenmessages
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get all messages for a selected user
const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, recevierId: selectedUserId },
                { senderId: selectedUserId, recevierId: myId },
            ],
            deletedBy: { $ne: myId }
        });

        await messageModel.updateMany({ senderId: selectedUserId, recevierId: myId }, { seen: true });

        res.json({
            success: true,
            messages
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Mark a specific message as seen
const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;  // fixed: was const id = req.params (whole object)

        await messageModel.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const recevierId = req.params.id;
        const senderId = req.user._id;  // fixed: was req.user_.id (typo)

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await messageModel.create({
            senderId,
            recevierId,
            text,
            image: imageUrl
        });

        // Emit message to receiver's socket
        const receiverSocketId = userSocketMap[recevierId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Toggle pin status of a chat
const togglePinChat = async (req, res) => {
    try {
        const { id: targetUserId } = req.params;
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        const isPinned = user.pinnedChats.includes(targetUserId);

        if (isPinned) {
            await userModel.findByIdAndUpdate(userId, { $pull: { pinnedChats: targetUserId } });
        } else {
            await userModel.findByIdAndUpdate(userId, { $push: { pinnedChats: targetUserId } });
        }

        res.json({ success: true, isPinned: !isPinned });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete a conversation (for the current user only)
const deleteConversation = async (req, res) => {
    try {
        const { id: targetUserId } = req.params;
        const myId = req.user._id;

        await messageModel.updateMany({
            $or: [
                { senderId: myId, recevierId: targetUserId },
                { senderId: targetUserId, recevierId: myId },
            ]
        }, { $addToSet: { deletedBy: myId } });

        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage, togglePinChat, deleteConversation };