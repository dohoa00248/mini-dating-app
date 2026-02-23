import express from 'express';
import ProfileUser from '../model/ProfileUser.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await ProfileUser.find().sort({ createdAt: -1 }).lean();

    res.render('admin', {
      users: users,
      title: 'Admin Dashboard',
    });
  } catch (error) {
    console.error('Admin Page Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, age, gender, bio, email } = req.body;

    // 1. Check if the email already exists
    const existingUser = await ProfileUser.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use!' });
    }

    // 2. Initialize new profile
    const newProfileUser = new ProfileUser({
      name,
      age,
      gender,
      bio,
      email,
    });

    // 3. Save to Database
    const savedProfile = await newProfileUser.save();

    res.status(201).json({
      success: true,
      message: 'Profile created successfully!',
      data: {
        id: savedProfile._id,
        name: savedProfile.name,
        email: savedProfile.email,
      },
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
