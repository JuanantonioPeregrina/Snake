const express = require('express');
const router = express.Router();
const { users } = require('../database');

// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    try {
        users.register(username, password);
        res.json({ message: `Usuario ${username} registrado exitosamente.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan credenciales.' });
    }

    const loginSuccess = await users.isLoginRight(username, password);

    if (loginSuccess) {
        res.json({ message: 'Inicio de sesión exitoso.', user: users.data[username] });
    } else {
        res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }
});

// Ruta para aceptar cookies
router.post('/accept-cookies', (req, res) => {
    const { username } = req.body;

    try {
        users.acceptCookies(username);
        res.json({ message: `Cookies aceptadas para ${username}.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para verificar si el usuario aceptó cookies
router.get('/has-accepted-cookies/:username', (req, res) => {
    const { username } = req.params;

    const hasAccepted = users.hasAcceptedCookies(username);
    res.json({ username, hasAccepted });
});

module.exports = router;
