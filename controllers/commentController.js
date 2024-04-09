const { Comment, Post, User } = require('../models');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId; 
    const postId = req.params.postId;
    const comment = await Comment.create({ content, userId, postId });
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }
    comment.content = content;
    await comment.save();
    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }
    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const postExists = await Post.findByPk(postId);
    if (!postExists) {
      return res.status(404).send({ message: 'Post not found' });
    }
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { createComment, updateComment, deleteComment, getCommentsByPost };
