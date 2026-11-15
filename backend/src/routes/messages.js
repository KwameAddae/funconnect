const express = require('express');
const router = express.Router();
const { getConversation, listConversations } = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

router.get('/conversations', requireAuth, listConversations);
router.get('/:userId',        requireAuth, getConversation);

module.exports = router;
