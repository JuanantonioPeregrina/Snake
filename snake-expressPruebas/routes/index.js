const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('index', { user: req.session.user, title: 'Snake Game', message: 'Bienvenido a Snake Game', player: 'Invitado' });
});

module.exports = router;
                     