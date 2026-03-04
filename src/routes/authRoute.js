import express from 'express';
import authController from '../controller/authController.js';

const router = express.Router();

router.get('/login', authController.getLoginPage);

router.get('/register', authController.getRegisterPage);

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);

router.post('/register', authController.registerUser);

router.post('/users/reset-password', authController.resetPasswordUser);

export default router;
