const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('../db');

// userId -> Set of socket ids (one user can have multiple devices/tabs)
const onlineUsers = new Map();

function attachSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  // AUTH MIDDLEWARE — runs before any socket connects
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Missing auth token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: payload.sub, username: payload.username };
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;

    // Register this socket
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    console.log(`[socket] user ${userId} (${socket.user.username}) connected — sockets: ${onlineUsers.get(userId).size}`);

    // Broadcast presence to everyone else
    socket.broadcast.emit('presence:online', { userId, username: socket.user.username });

    // Send current online list to the new client
    socket.emit('presence:list', {
      userIds: [...onlineUsers.keys()].filter((id) => id !== userId),
    });

    // ---- CHAT: SEND MESSAGE ----
    socket.on('message:send', async ({ to, content }, ack) => {
      try {
        const toId = parseInt(to, 10);
        if (!toId || typeof content !== 'string' || content.trim().length === 0) {
          return ack?.({ error: 'to and content are required' });
        }
        if (content.length > 2000) {
          return ack?.({ error: 'message too long' });
        }

        const result = await db.query(
          `INSERT INTO messages (sender_id, receiver_id, content)
           VALUES ($1, $2, $3)
           RETURNING id, sender_id, receiver_id, content, read_at, created_at`,
          [userId, toId, content.trim()]
        );
        const message = {
          ...result.rows[0],
          sender_username: socket.user.username,
        };

        // Deliver to all of the receiver's active sockets
        const receiverSockets = onlineUsers.get(toId);
        if (receiverSockets) {
          for (const sid of receiverSockets) {
            io.to(sid).emit('message:new', message);
          }
        }

        // Echo back to sender (so other sender tabs get it too)
        for (const sid of onlineUsers.get(userId)) {
          if (sid !== socket.id) io.to(sid).emit('message:new', message);
        }

        ack?.({ ok: true, message });
      } catch (err) {
        console.error('message:send error:', err);
        ack?.({ error: 'Internal server error' });
      }
    });

    // ---- CHAT: TYPING INDICATOR ----
    socket.on('message:typing', ({ to, isTyping }) => {
      const toId = parseInt(to, 10);
      if (!toId) return;
      const receiverSockets = onlineUsers.get(toId);
      if (receiverSockets) {
        for (const sid of receiverSockets) {
          io.to(sid).emit('message:typing', {
            from: userId,
            username: socket.user.username,
            isTyping: !!isTyping,
          });
        }
      }
    });

    // ---- DISCONNECT ----
    socket.on('disconnect', () => {
      const set = onlineUsers.get(userId);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('presence:offline', { userId });
        }
      }
      console.log(`[socket] user ${userId} disconnected`);
    });
  });

  return io;
}

module.exports = { attachSocketServer, onlineUsers };
