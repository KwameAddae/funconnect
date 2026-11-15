const db = require('../db');

// GET /api/messages/:userId?limit=30&before=<id>  (auth required)
async function getConversation(req, res) {
  try {
    const otherId = parseInt(req.params.userId, 10);
    if (!otherId) return res.status(400).json({ error: 'Invalid user id' });

    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const before = parseInt(req.query.before, 10) || null;

    const params = [req.user.id, otherId, limit];
    let beforeClause = '';
    if (before) {
      params.push(before);
      beforeClause = 'AND m.id < $4';
    }

    const result = await db.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.read_at, m.created_at,
              s.username AS sender_username, r.username AS receiver_username
       FROM messages m
       JOIN users s ON s.id = m.sender_id
       JOIN users r ON r.id = m.receiver_id
       WHERE ((m.sender_id = $1 AND m.receiver_id = $2)
           OR (m.sender_id = $2 AND m.receiver_id = $1))
       ${beforeClause}
       ORDER BY m.id DESC
       LIMIT $3`,
      params
    );

    // Mark incoming messages as read
    await db.query(
      `UPDATE messages SET read_at = NOW()
       WHERE sender_id = $1 AND receiver_id = $2 AND read_at IS NULL`,
      [otherId, req.user.id]
    );

    return res.json({ messages: result.rows.reverse() });
  } catch (err) {
    console.error('getConversation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/messages/conversations  (auth required) — list of recent conversations
async function listConversations(req, res) {
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (other_id)
         other_id, other_username, last_content, last_at, unread
       FROM (
         SELECT
           CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS other_id,
           u.username AS other_username,
           m.content AS last_content,
           m.created_at AS last_at,
           (SELECT COUNT(*) FROM messages
            WHERE receiver_id = $1 AND sender_id = u.id AND read_at IS NULL) AS unread
         FROM messages m
         JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
         WHERE m.sender_id = $1 OR m.receiver_id = $1
         ORDER BY m.created_at DESC
       ) sub
       ORDER BY other_id, last_at DESC`,
      [req.user.id]
    );
    return res.json({ conversations: result.rows });
  } catch (err) {
    console.error('listConversations error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getConversation, listConversations };
