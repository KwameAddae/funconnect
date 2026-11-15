const db = require('../db');

// POST /api/posts  (auth required)
async function createPost(req, res) {
  try {
    const { content, image_url } = req.body || {};

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'content is required' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ error: 'content must be 2000 characters or less' });
    }

    const result = await db.query(
      `INSERT INTO posts (user_id, content, image_url)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, content, image_url, created_at`,
      [req.user.id, content.trim(), image_url || '']
    );

    return res.status(201).json({ post: result.rows[0] });
  } catch (err) {
    console.error('createPost error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/posts/feed?limit=20&before=<id>
async function getFeed(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const before = parseInt(req.query.before, 10) || null;

    const params = [limit];
    let whereClause = '';
    if (before) {
      params.push(before);
      whereClause = 'WHERE p.id < $2';
    }

    const result = await db.query(
      `SELECT p.id, p.content, p.image_url, p.created_at,
              u.id AS author_id, u.username AS author_username,
              u.avatar_url AS author_avatar
       FROM posts p
       JOIN users u ON u.id = p.user_id
       ${whereClause}
       ORDER BY p.id DESC
       LIMIT $1`,
      params
    );

    return res.json({ posts: result.rows });
  } catch (err) {
    console.error('getFeed error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/posts/:id  (auth required, owner only)
async function deletePost(req, res) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (!postId) {
      return res.status(400).json({ error: 'Invalid post id' });
    }

    const result = await db.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [postId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (result.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    return res.json({ deleted: true });
  } catch (err) {
    console.error('deletePost error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createPost, getFeed, deletePost };
