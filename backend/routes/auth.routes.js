import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { signUp, login, checkAuth } from '../controller/auth.controller.js';

const route = express.Router();

route.post('/signUp', signUp);
route.post('/login', login);

route.get('/check', authMiddleware, checkAuth); // check if user is authenticated

export default route;