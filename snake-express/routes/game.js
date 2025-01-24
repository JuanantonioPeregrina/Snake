// Ruta para procesar el puntaje enviado
const express = require('express');
const router = express.Router();

// Ruta GET para renderizar la vista del juego
router.get('/', (req, res) => {
    // Renderiza game.ejs y pasa datos necesarios como usuario y título
    res.render('game', { 
        user: req.session.user || { username: 'Invitado' }, 
        title: 'Snake Game', 
        message: '¡A jugar!', 
        player: 'Invitado' || req.session.user.username
    });
});

// Ruta POST para procesar el puntaje enviado
router.post('/game', (req, res) => {
    const { user, score } = req.body;

    // Validar datos
    if (!user || !score) {
        return res.status(400).send("Faltan datos.");
    }

    console.log(`Usuario: ${user}, Puntaje: ${score}`);
    res.send("Puntaje procesado correctamente."); 
});

module.exports = router;