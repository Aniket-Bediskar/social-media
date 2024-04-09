const { Like, Post } = require('../models');

const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const existingLike = await Like.findOne({ where: { userId, postId } });
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }
    await Like.create({ userId, postId });
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await post.increment('likes');

    res.status(201).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const unlikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const existingLike = await Like.findOne({ where: { userId, postId } });
    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }
    await existingLike.destroy();
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await post.decrement('likes');

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { likePost, unlikePost };
