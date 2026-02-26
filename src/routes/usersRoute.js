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

router.post('/:id/toggle-like', async (req, res) => {
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
