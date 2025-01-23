const express = require('express');
const router = express.Router();
const { users } = require('../database'); // Asegúrate de importar correctamente tu base de datos

// Ruta para manejar el login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan credenciales.' });
  }

  const loginSuccess = await users.isLoginRight(username, password);

  if (loginSuccess) {
    req.session.user = { username }; // Guarda el usuario en la sesión
    res.redirect('/restricted'); // Redirige a la página restringida
  } else {
    res.render('login', { 
      title: 'Login',
      message: 'Usuario o contraseña incorrectos.' 
    });
  }
});

module.exports = router;
