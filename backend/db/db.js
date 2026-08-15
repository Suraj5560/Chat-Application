import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4, // Force IPv4 to prevent 30s IPv6 timeout issues
        });
        console.log('DataBase is connected');
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;