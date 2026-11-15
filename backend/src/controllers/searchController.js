const db = require('../db');

// GET /api/search?q=...  — searches users + posts
async function search(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }
    const pattern = `%${q}%`;

    const [users, posts] = await Promise.all([
      db.query(
        `SELECT id, username, bio, avatar_url
         FROM users
         WHERE username ILIKE $1
         ORDER BY username ASC
         LIMIT 20`,
        [pattern]
      ),
      db.query(
        `SELECT p.id, p.content, p.image_url, p.created_at,
                u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar
         FROM posts p
         JOIN users u ON u.id = p.user_id
         WHERE p.content ILIKE $1
         ORDER BY p.id DESC
         LIMIT 20`,
        [pattern]
      ),
    ]);

    return res.json({ users: users.rows, posts: posts.rows });
  } catch (err) {
    console.error('search error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { search };
