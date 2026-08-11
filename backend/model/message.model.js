import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recevierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String       // fixed: was {String} shorthand which is incorrect
    },
    image: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    deletedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;