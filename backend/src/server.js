require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const db = require('./db');
const { attachSocketServer } = require('./sockets');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');


const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS time, current_database() AS db');
    res.json({ status: 'ok', app: 'FunConnect API', db: result.rows[0].db, time: result.rows[0].time });
  } catch (err) {
    res.status(500).json({ status: 'db_error', error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);


const server = http.createServer(app);
const io = attachSocketServer(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`FunConnect API + Socket.io listening on http://localhost:${PORT}`);
});

module.exports = { io };
