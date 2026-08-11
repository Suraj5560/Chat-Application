import mongoose from 'mongoose';

// Fixed: removed duplicate email field, added password field
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: ''
    },
    bio: String,
    pinnedChats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

export default userModel;