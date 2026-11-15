require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Health check — hits the REAL database
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS time, current_database() AS db');
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

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`FunConnect API listening on http://localhost:${PORT}`);
});
