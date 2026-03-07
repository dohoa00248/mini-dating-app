import express from 'express';
import userController from '../controller/userController.js';
import authController from '../controller/authController.js';
const router = express.Router();

router.get(
  '/dashboard',
  authController.authLogin,
  userController.getUserDashboard,
);

router.get('/likes', authController.authLogin, userController.getLikedUsers);

router.get(
  '/matches',
  authController.authLogin,
  userController.getMatchedUsers,
);

router.get(
  '/schedules',
  authController.authLogin,
  userController.getScheduledUsers,
);

router.post(
  '/:id/toggle-like',
  authController.authLogin,
  userController.toggleLikeUser,
);

router.get(
  '/:matchedUserId/availability',
  authController.authLogin,
  userController.getSchedulePage,
);

router.post(
  '/:matchedUserId/availability',
  authController.authLogin,
  userController.proposeAvailability,
);

export default router;
