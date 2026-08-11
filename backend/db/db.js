import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://backend:C9vSaFcWq13EbDcy@backend-tuto.ld74hxk.mongodb.net/chat-app');
        console.log('DataBase is connected');
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;