import express from 'express';
import adminController from '../controller/adminController.js';
import authController from '../controller/authController.js';
const router = express.Router();

router.get(
  '/dashboard',
  authController.authLogin,
  adminController.getAdminDashboard,
);

router.post(
  '/create',
  authController.authLogin,
  adminController.createProfileUser,
);

router.get(
  '/users/:id/likes',
  authController.authLogin,
  adminController.getUserLikes,
);

export default router;
