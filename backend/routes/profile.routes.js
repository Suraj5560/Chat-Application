import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controller/profile.controller.js';

const route = express.Router();

route.put('/update-profile', authMiddleware, updateProfile);

export default route;