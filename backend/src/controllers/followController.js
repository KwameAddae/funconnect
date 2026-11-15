const db = require('../db');

// POST /api/users/:id/follow  (auth required)
async function follow(req, res) {
  try {
    const followeeId = parseInt(req.params.id, 10);
    if (!followeeId) return res.status(400).json({ error: 'Invalid user id' });
    if (followeeId === req.user.id) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const exists = await db.query('SELECT 1 FROM users WHERE id = $1', [followeeId]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.query(
      `INSERT INTO follows (follower_id, followee_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, followeeId]
    );

    return res.json({ following: true, followeeId });
  } catch (err) {
    console.error('follow error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/users/:id/follow  (auth required)
async function unfollow(req, res) {
  try {
    const followeeId = parseInt(req.params.id, 10);
    if (!followeeId) return res.status(400).json({ error: 'Invalid user id' });

    await db.query(
      'DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2',
      [req.user.id, followeeId]
    );

    return res.json({ following: false, followeeId });
  } catch (err) {
    console.error('unfollow error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/users/:id/followers  — public
async function followers(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!userId) return res.status(400).json({ error: 'Invalid user id' });

    const result = await db.query(
      `SELECT u.id, u.username, u.avatar_url, f.created_at AS followed_at
       FROM follows f
       JOIN users u ON u.id = f.follower_id
       WHERE f.followee_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return res.json({ followers: result.rows });
  } catch (err) {
    console.error('followers error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/users/:id/following  — public
async function following(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!userId) return res.status(400).json({ error: 'Invalid user id' });

    const result = await db.query(
      `SELECT u.id, u.username, u.avatar_url, f.created_at AS followed_at
       FROM follows f
       JOIN users u ON u.id = f.followee_id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return res.json({ following: result.rows });
  } catch (err) {
    console.error('following error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { follow, unfollow, followers, following };
