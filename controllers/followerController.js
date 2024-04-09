const { Follower, User } = require('../models');

const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;
    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    const existingFollower = await Follower.findOne({ where: { followerId, followingId } });
    if (existingFollower) {
      return res.status(400).json({ message: 'You are already following this user' });
    }
    await Follower.create({ followerId, followingId });
    const targetUser = await User.findByPk(followingId);
    if (targetUser) {
      await targetUser.increment('followerCount');
    }
    const followerUser = await User.findByPk(followerId);
    if (followerUser) {
      await followerUser.increment('followingCount');
    }

    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;
    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }
    const follower = await Follower.findOne({ where: { followerId, followingId } });
    if (!follower) {
      return res.status(404).json({ message: 'You are not following this user' });
    }
    await follower.destroy();
    const targetUser = await User.findByPk(followingId);
    if (targetUser && targetUser.followerCount > 0) {
      await targetUser.decrement('followerCount');
    }

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserFollowerFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const followerCount = user.followerCount || 0;
    const followingCount = await Follower.count({ where: { followerId: userId } });

    res.status(200).json({ userId, followerCount, followingCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { followUser, unfollowUser, getUserFollowerFollowing };