const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Use the original filename
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware.authenticateToken, upload.single('media'), postController.createPost);
router.get('/', postController.getAllPosts);
router.post('/:postId/like', authMiddleware.authenticateToken, postController.likePost);
router.get('/:postId', authMiddleware.authenticateToken, postController.getPostWithLikes);

module.exports = router;
