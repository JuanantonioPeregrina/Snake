const express = require('express');
const router = express.Router();

// Ruta principal sin res.locals
/*router.get('/', (req, res) => {
  res.render('index', { user: req.session.user, title: 'Snake Game', message: 'Bienvenido a Snake Game', player: 'Invitado' });
});

module.exports = router;
*/

// Ruta principal con res.locals
router.get('/', (req, res) => {
  res.locals.title = "Snake Game"; // Título global
  res.locals.user = req.session.user || { username: "Invitado" }; // Usuario actual
  res.locals.message = req.session.user 
    ? `¡Bienvenido de nuevo, ${req.session.user.username}!`
    : "Bienvenido a Snake Game";

  res.render('index');
});

module.exports = router;