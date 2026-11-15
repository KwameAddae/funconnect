require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const db = require('./db');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Health check — hits the REAL database
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS time, current_database() AS db');
    res.json({
      status: 'ok',
      app: 'FunConnect API',
      db: result.rows[0].db,
      time: result.rows[0].time,
    });
  } catch (err) {
    res.status(500).json({ status: 'db_error', error: err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`FunConnect API listening on http://localhost:${PORT}`);
});
