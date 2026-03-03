import express from 'express';
import ProfileUser from '../model/ProfileUser.js';
import Availability from '../model/Availability.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const currentUserId = req.session.user._id;

    const currentUser = await ProfileUser.findById(currentUserId);

    const users = await ProfileUser.find({
      _id: { $ne: currentUserId },
      role: { $ne: 1 },
    });

    for (let user of users) {
      user.isMatched = currentUser.matches.some((matchId) =>
        matchId.equals(user._id),
      );
    }

    res.render('users', {
      newUser: currentUser,
      users: users,
    });
  } catch (err) {
    console.error(err);
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
    const userId = req.session.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const currentUser = await ProfileUser.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const matches = await ProfileUser.find({
      _id: { $in: currentUser.likes },
      likes: userId,
    }).select('name age gender bio');

    const result = await Promise.all(
      matches.map(async (matchUser) => {
        const availability = await Availability.findOne({
          $or: [
            { userA: userId, userB: matchUser._id },
            { userA: matchUser._id, userB: userId },
          ],
        });

        let myProposedSlots = [];

        if (availability && availability.slots) {
          myProposedSlots = availability.slots.get(userId.toString()) || [];
        }

        return {
          _id: matchUser._id,
          name: matchUser.name,
          age: matchUser.age,
          gender: matchUser.gender,
          bio: matchUser.bio,
          myProposedSlots,
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: 'Matches fetched successfully!',
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.get('/matched-schedules', async (req, res) => {
  try {
    const currentUserId = req.session.user?._id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const availabilities = await Availability.find({
      $or: [{ userA: currentUserId }, { userB: currentUserId }],
      finalDate: { $ne: null },
    })
      .populate('userA', 'name age gender bio')
      .populate('userB', 'name age gender bio');

    const result = availabilities.map((item) => {
      const isUserA = item.userA._id.toString() === currentUserId.toString();

      const matchedUser = isUserA ? item.userB : item.userA;

      return {
        matchId: matchedUser._id,
        name: matchedUser.name,
        age: matchedUser.age,
        gender: matchedUser.gender,
        bio: matchedUser.bio,
        finalDate: item.finalDate,
      };
    });

    return res.status(200).json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.get('/schedule/:matchUserId', async (req, res) => {
  try {
    const currentUserId = req.session.user?._id;
    const { matchUserId } = req.params;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const availability = await Availability.findOne({
      $or: [
        { userA: currentUserId, userB: matchUserId },
        { userA: matchUserId, userB: currentUserId },
      ],
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found',
      });
    }

    if (!availability.finalDate) {
      return res.status(400).json({
        success: false,
        message: 'Schedule not finalized yet',
      });
    }

    return res.status(200).json({
      success: true,
      finalDate: availability.finalDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
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

router.get('/:matchedUserId/availability', async (req, res) => {
  try {
    // 1️⃣ Check login
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const userId = req.session.user._id.toString();
    const { matchedUserId } = req.params;

    // 2️⃣ Check user tồn tại
    const currentUser = await ProfileUser.findById(userId);
    const matchedUser = await ProfileUser.findById(matchedUserId);

    if (
      !currentUser ||
      !matchedUser ||
      !currentUser.likes.includes(matchedUserId) ||
      !matchedUser.likes.includes(userId)
    ) {
      return res.status(403).render('error', {
        message: 'Hai bạn chưa match.',
      });
    }

    // 3️⃣ Chuẩn hóa thứ tự user
    const sortedIds = [userId, matchedUserId].sort();
    const userA = sortedIds[0];
    const userB = sortedIds[1];

    // 4️⃣ Tìm availability document
    const availabilityDoc = await Availability.findOne({ userA, userB });

    // 5️⃣ Tính giới hạn 3 tuần
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 21);

    return res.render('availability.ejs', {
      matchedUser,
      availability: availabilityDoc || null,
      today: today.toISOString().split('T')[0],
      maxDate: maxDate.toISOString().split('T')[0],
      currentUserId: userId,
    });
  } catch (error) {
    return res.status(500).render('error', {
      message: error.message,
    });
  }
});

router.post('/:matchedUserId/availability', async (req, res) => {
  try {
    //  Check authentication
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
      });
    }

    const userId = req.session.user._id.toString();
    const { matchedUserId } = req.params;
    const { slots } = req.body;

    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Slots must be a non-empty array.',
      });
    }

    //  Verify mutual match
    const currentUser = await ProfileUser.findById(userId);
    const matchedUser = await ProfileUser.findById(matchedUserId);

    const isMatched =
      currentUser &&
      matchedUser &&
      currentUser.likes.includes(matchedUserId) &&
      matchedUser.likes.includes(userId);

    if (!isMatched) {
      return res.status(403).json({
        success: false,
        message: 'You are not matched with this user.',
      });
    }

    //  Validate 3-week constraint and normalize dates
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + 21);

    const normalizedSlots = slots.map((slot) => {
      const start = new Date(slot.start);
      const end = new Date(slot.end);

      if (start < now || start > limit) {
        throw new Error('Slot must be within the next 3 weeks.');
      }

      if (start >= end) {
        throw new Error('Start time must be before end time.');
      }

      return { start, end };
    });

    //  Normalize user order to avoid duplicate documents
    const sortedIds = [userId, matchedUserId].sort();
    const userA = sortedIds[0];
    const userB = sortedIds[1];

    //  Upsert availability document
    let availabilityDoc = await Availability.findOne({ userA, userB });

    if (!availabilityDoc) {
      availabilityDoc = await Availability.create({
        userA,
        userB,
      });
    }

    //  Store slots per user (Map field)
    availabilityDoc.slots.set(userId, normalizedSlots);
    await availabilityDoc.save();

    const slotsA = availabilityDoc.slots.get(userA) || [];
    const slotsB = availabilityDoc.slots.get(userB) || [];

    //  If one side hasn't submitted availability yet
    if (!slotsA.length || !slotsB.length) {
      return res.status(200).json({
        success: true,
        message: 'Availability saved. Waiting for the other user.',
      });
    }

    // Find first overlapping slot
    for (let a of slotsA) {
      for (let b of slotsB) {
        const maxStart = a.start > b.start ? a.start : b.start;
        const minEnd = a.end < b.end ? a.end : b.end;

        if (maxStart < minEnd) {
          availabilityDoc.finalDate = {
            start: maxStart,
            end: minEnd,
          };

          await availabilityDoc.save();

          return res.status(200).json({
            success: true,
            message: `You have a date scheduled on: ${maxStart.toLocaleString()}`,
            data: availabilityDoc.finalDate,
          });
        }
      }
    }

    //  No overlap found
    return res.status(200).json({
      success: true,
      message: 'No overlapping time found. Please select again.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
