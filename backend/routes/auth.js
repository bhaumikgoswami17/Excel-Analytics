import express from 'express';
import { registerUser, loginUser, verifyOtp, getUserProfile, updateProfile, upload } from '../controllers/authcontrollers.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.get('/profile', authenticate, getUserProfile);
router.put('/update-profile', authenticate, upload.single('avatar'), updateProfile);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

export default router;
