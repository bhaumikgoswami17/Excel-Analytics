import express from 'express';
import { registerUser, loginUser, verifyOtp } from '../controllers/authcontrollers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

export default router;
