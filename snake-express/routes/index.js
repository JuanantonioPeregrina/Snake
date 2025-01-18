const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('index', { title: 'Snake Game' });
});

module.exports = router;
                     