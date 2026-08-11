import express from 'express';
import 'dotenv/config';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './db/db.js';
import authRoute from './routes/auth.routes.js';
import profileRoute from './routes/profile.routes.js';
import messageRoute from './routes/message.routes.js';

connectDB();

const app = express();
const server = createServer(app);

// Initializing socket.io server
const io = new Server(server, {
    cors: { origin: '*' }
});

// Store online users: { userId: socketId }
export const userSocketMap = {};

// Socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected', userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User Disconnected', userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

app.use(cors({
    origin: function(origin, callback) {
        if(!origin) return callback(null, true);
        if(origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        return callback(new Error('CORS blocked origin ' + origin), false);
    },
    credentials: true,
}));
app.use(express.json({ limit: '4mb' }));

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Route setup
app.use('/api/auth', authRoute);
app.use('/update-profile', profileRoute);
app.use('/api/message', messageRoute);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

export { io };