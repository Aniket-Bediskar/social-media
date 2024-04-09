const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:postId', authMiddleware.authenticateToken, commentController.createComment);
router.put('/:commentId', authMiddleware.authenticateToken, commentController.updateComment);
router.get('/:postId/comments', commentController.getCommentsByPost);
router.delete('/:commentId', authMiddleware.authenticateToken, commentController.deleteComment);

module.exports = router;
