const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded (field name must be "image")' });

    const url = `/uploads/${req.file.filename}`;
    return res.status(201).json({ url, filename: req.file.filename, size: req.file.size });
  });
});

module.exports = router;
