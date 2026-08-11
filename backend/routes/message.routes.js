import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage, togglePinChat, deleteConversation } from '../controller/message.controller.js';

const route = express.Router();

route.get('/sidebar-users', authMiddleware, getUserForSidebar);
route.get('/:id', authMiddleware, getMessages);
route.post('/:id', authMiddleware, sendMessage);          // added: was missing from routes
route.put('/mark/:id', authMiddleware, markMessageAsSeen);
route.put('/pin/:id', authMiddleware, togglePinChat);
route.delete('/conversation/:id', authMiddleware, deleteConversation);

export default route;
