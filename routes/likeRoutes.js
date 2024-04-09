const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:postId', authMiddleware.authenticateToken, likeController.likePost);
router.delete('/:postId', authMiddleware.authenticateToken, likeController.unlikePost);

module.exports = router;
