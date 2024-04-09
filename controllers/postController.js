const Post = require('../models/Post');
const User = require('../models/User');
const Like = require('../models/Like');

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const mediaUrl = req.file ? req.file.path : null; 
    const userId = req.user.userId;

    const post = await Post.create({ content, mediaUrl, userId });
    res.status(201).json({ status: 201, message: 'Post created successfully', data: post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id', 'username'] } ]
    });
    res.status(200).json({ status: 200, message: 'Posts fetched successfully', data: posts });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ status: 404, message: 'Post not found' });
    }
    const alreadyLiked = await post.hasLiked(userId);
    if (alreadyLiked) {
      return res.status(400).json({ status: 400, message: 'You have already liked this post' });
    }
    await post.increment('likes');
    await post.addLiker(userId);

    res.status(200).json({ status: 200, message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
  }};

  const getPostWithLikes = async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: Like,
            include: [User]
          }
        ]
      });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const totalLikes = post.Likes.length;
      const likedBy = post.Likes.map(like => like.User.id);
  
      res.status(200).json({
        message: 'Post details fetched successfully',
        data: {
          post,
          totalLikes,
          likedBy
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = { createPost, getAllPosts, likePost, getPostWithLikes };
