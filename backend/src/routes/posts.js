const express = require('express');
const router = express.Router();
const { createPost, getFeed, deletePost } = require('../controllers/postController');
const { requireAuth } = require('../middleware/auth');

router.post('/',       requireAuth, createPost);
router.get('/feed',    getFeed);
router.delete('/:id',  requireAuth, deletePost);

module.exports = router;
