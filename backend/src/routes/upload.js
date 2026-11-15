const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Cloudinary returns the full URL in req.file.path
    return res.status(201).json({ 
      url: req.file.path, 
      filename: req.file.filename 
    });
  });
});

module.exports = router;
