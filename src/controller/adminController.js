import ProfileUser from '../model/ProfileUser.js';
import bcrypt from 'bcryptjs';
const getAdminDashboard = async (req, res) => {
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
};

const createProfileUser = async (req, res) => {
  try {
    const { name, age, gender, bio, email } = req.body;

    const existingUser = await ProfileUser.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = new ProfileUser({
      name,
      age,
      gender,
      bio,
      email: email.toLowerCase(),
      password: hashedPassword,
      mustChangePassword: true,
      likes: [],
      matches: [],
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await ProfileUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    const populatedUser = await ProfileUser.findById(id).populate(
      'likes',
      'name email gender age',
    );

    res.status(200).json({
      success: true,
      message: 'Liked users fetched successfully!',
      total: populatedUser.likes.length,
      data: populatedUser.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
export default {
  getAdminDashboard,
  createProfileUser,
  getUserLikes,
};
