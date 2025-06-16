import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendOTP } from '../utils/sendEmail.js';
import { generateToken } from '../utils/generateToken.js'; // ✅ Import generateToken

// @desc Register new user with OTP verification
export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, username, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    const newUser = new User({
      username,
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

// @desc Verify OTP and activate user account
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user); // ✅ Updated

    res.status(200).json({
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// @desc Login user (only if verified)
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify OTP.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user); // ✅ Updated

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
