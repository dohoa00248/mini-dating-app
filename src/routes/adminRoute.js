import express from 'express';
import adminController from '../controller/adminController.js';

const router = express.Router();

router.get('/dashboard', adminController.getAdminDashboard);

router.post('/create', adminController.createProfileUser);

router.get('/users/:id/likes', adminController.getUserLikes);

export default router;
