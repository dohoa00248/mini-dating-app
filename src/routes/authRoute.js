import express from 'express';
import ProfileUser from '../model/ProfileUser.js';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.get('/signin', (req, res) => {
  res.render('signin.ejs');
});

router.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await ProfileUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Initialize session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Success response with role-based redirect
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        userId: user._id,
        name: user.name,
        role: user.role,
        redirectTo: user.role === 1 ? '/admin' : '/users',
      },
    });
  } catch (error) {
    console.error('Signin Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, age, gender, bio, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await ProfileUser.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new profile
    const newProfileUser = new ProfileUser({
      name,
      age,
      gender,
      bio,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 2,
    });

    // Save to DB
    const savedProfile = await newProfileUser.save();

    res.status(201).json({
      success: true,
      message: 'User created',
      data: { id: savedProfile._id, email: savedProfile.email },
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/users/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;

    // 1. Validate
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required!',
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update tất cả user KHÔNG phải admin (role != 1)
    const result = await ProfileUser.updateMany(
      { role: { $ne: 1 } }, // loại admin
      { password: hashedPassword },
    );

    res.status(200).json({
      success: true,
      message: 'All user passwords updated (except admin)!',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

export default router;
