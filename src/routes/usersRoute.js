import express from 'express';
import userController from '../controller/userController.js';

const router = express.Router();

router.get('/dashboard', userController.getUserDashboard);

router.get('/likes', userController.getLikedUsers);

router.get('/matches', userController.getMatchedUsers);

router.get('/schedules', userController.getScheduledUsers);

router.post('/:id/toggle-like', userController.toggleLikeUser);

router.get('/:matchedUserId/availability', userController.getSchedulePage);

router.post('/:matchedUserId/availability', userController.proposeAvailability);

export default router;
