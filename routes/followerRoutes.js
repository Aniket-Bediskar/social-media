const express = require('express');
const router = express.Router();
const followerController = require('../controllers/followerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:userId', authMiddleware.authenticateToken, followerController.followUser);
router.delete('/:userId', authMiddleware.authenticateToken, followerController.unfollowUser);

module.exports = router;
