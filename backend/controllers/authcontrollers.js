import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendOTP } from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1d' }
  );
};

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

    const newUser = new User({
      email,
      password,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required' });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'User already verified' });

    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      message: 'OTP verified successfully',
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// @desc    Login user (only if verified)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Account not verified. Please verify OTP.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);

    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
