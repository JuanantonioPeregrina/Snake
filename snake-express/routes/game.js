const express = require('express');
const router = express.Router();

// Importa tu modelo de puntajes
const scores = require('../database/models/score.model');

// Ruta GET para mostrar la página del juego (solo usuarios registrados)
router.get('/', (req, res) => {
    // Validar si el usuario está autenticado
    if (!req.session.user || req.session.user.username === "Invitado") {
        req.session.message = "Debes iniciar sesión para jugar.";
        return res.redirect('/login'); // Redirige al login si no está autenticado
    }
    
    // Obtener los puntajes y renderizar la página del juego
    const topScores = scores.getTopScores();
    res.render('game', {
        user: req.session.user, // Información del usuario autenticado
        title: "Snake Game",
        message: "¡A jugar!",
        player: req.session.user.username, // Nombre del jugador
        scores: topScores // Pasar los puntajes a la vista
    });
});

// Ruta POST para registrar un nuevo puntaje

router.post('/', (req, res) => { // NOTA: El endpoint es `/` porque `app.use('/game', gameRouter)` lo antepone
    const { score } = req.body;
    const username = req.session.user ? req.session.user.username : "Invitado";

    console.log("Datos recibidos en el servidor:", { username, score });

    if (!username || typeof score !== 'number') {
        return res.status(400).json({ error: "Faltan datos o formato incorrecto." });
    }

    scores.registerScore(username, score);

    const topScores = scores.getTopScores();
    console.log("Puntajes actualizados:", topScores);

    res.status(200).json(topScores);

});


// Ruta GET para devolver los puntajes en formato JSON (usado por el cliente)
router.get('/scores', (req, res) => {
    const topScores = scores.getTopScores(); // Obtén los puntajes
    res.status(200).json(topScores); // Devuelve los puntajes al cliente
});

module.exports = router;
