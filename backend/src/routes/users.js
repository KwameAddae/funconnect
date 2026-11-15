const express = require('express');
const router = express.Router();
const { follow, unfollow, followers, following } = require('../controllers/followController');
const { requireAuth } = require('../middleware/auth');

router.post('/:id/follow',    requireAuth, follow);
router.delete('/:id/follow',  requireAuth, unfollow);
router.get('/:id/followers',  followers);
router.get('/:id/following',  following);

module.exports = router;
