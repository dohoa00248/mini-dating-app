import express from 'express';
import ProfileUser from '../model/ProfileUser.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const currentUserId = req.session.user._id;

    const currentUser = await ProfileUser.findById(currentUserId);

    const users = await ProfileUser.find({
      _id: { $ne: currentUserId },
      role: { $ne: 1 },
    });

    res.render('users', {
      newUser: currentUser,
      users: users,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/likes-detail', async (req, res) => {
  try {
    // Check authentication
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const currentUserId = req.session.user._id;

    // Get current user
    const currentUser = await ProfileUser.findById(currentUserId).populate(
      'likes',
      'name gender age bio',
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return liked users
    res.status(200).json({
      success: true,
      message: 'Likes fetched successfully!',
      total: currentUser.likes.length,
      data: currentUser.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.get('/matches-detail', async (req, res) => {
  try {
    // 🔥 Lấy từ session thay vì req.query
    const userId = req.session.user._id;

    // Check session tồn tại
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get current user
    const currentUser = await ProfileUser.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find mutual likes (matches)
    const matches = await ProfileUser.find({
      _id: { $in: currentUser.likes },
      likes: userId,
    });

    // Return matches
    res.status(200).json({
      success: true,
      message: 'Matches fetched successfully!',
      total: matches.length,
      data: matches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.post('/:id/toggle-like', async (req, res) => {
  try {
    const myId = req.session.user._id;
    const targetId = req.params.id;

    if (!myId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (myId === targetId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot like yourself',
      });
    }

    const me = await ProfileUser.findById(myId);

    if (!me) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const hasLiked = me.likes.includes(targetId);

    if (hasLiked) {
      // 🔥 UNLIKE
      await ProfileUser.findByIdAndUpdate(myId, {
        $pull: { likes: targetId, matches: targetId },
      });

      await ProfileUser.findByIdAndUpdate(targetId, {
        $pull: { matches: myId },
      });

      return res.json({
        success: true,
        isMatch: false,
        action: 'unliked',
      });
    } else {
      // 🔥 LIKE
      await ProfileUser.findByIdAndUpdate(myId, {
        $addToSet: { likes: targetId },
      });

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

      return res.json({
        success: true,
        isMatch,
        action: 'liked',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

export default router;
