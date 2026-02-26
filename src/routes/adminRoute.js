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
    const { name, age, gender, bio, email, likes, matches } = req.body;

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
      likes,
      matches,
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

router.get('/users/:id/likes-detail', async (req, res) => {
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
});

router.post('/users/:id/toggle-like', async (req, res) => {
  try {
    const myId = req.body.myId;
    const targetId = req.params.id;

    if (!myId) {
      return res.status(400).json({ success: false, message: 'Missing myId' });
    }

    const me = await ProfileUser.findById(myId);
    const hasLiked = me.likes.includes(targetId);

    if (hasLiked) {
      // LOGIC UNLIKE
      await ProfileUser.findByIdAndUpdate(myId, {
        $pull: { likes: targetId, matches: targetId },
      });
      await ProfileUser.findByIdAndUpdate(targetId, {
        $pull: { matches: myId },
      });
      return res.json({ success: true, isMatch: false, action: 'unliked' });
    } else {
      // LOGIC LIKE
      await ProfileUser.findByIdAndUpdate(myId, {
        $addToSet: { likes: targetId },
      });

      //Check for a Mutual Match
      const crush = await ProfileUser.findById(targetId);
      let isMatch = false;

      if (crush && crush.likes.includes(myId)) {
        isMatch = true;
        await ProfileUser.findByIdAndUpdate(myId, {
          $addToSet: { matches: targetId },
        });
        await ProfileUser.findByIdAndUpdate(targetId, {
          $addToSet: { matches: myId },
        });
      }

      return res.json({ success: true, isMatch, action: 'liked' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
