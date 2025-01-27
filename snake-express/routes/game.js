/*const express = require('express');
const router = express.Router();

// Importa tu modelo de puntajes
const scores = require('../database/models/score.model');

// Ruta GET para mostrar la página del juego (solo usuarios registrados)
router.get('/', (req, res) => {
    //Obligar a que el usuario esté autenticado  
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
*/
/*Tanto invitados como registrados acceden*/
const express = require('express');


// Importa tu modelo de puntajes
const scores = require('../database/models/score.model');


module.exports = (io) => {
const router = express.Router();
// Ruta GET para mostrar la página del juego (permitiendo invitados)
router.get('/', (req, res) => {
    // Verifica si el usuario está autenticado o establece un usuario por defecto como "Invitado"
    const user = req.session.user || { username: "Invitado" };

    // Obtener los puntajes y renderizar la página del juego
    const topScores = scores.getTopScores();
    res.render('game', {
        user, // Información del usuario (autenticado o "Invitado")
        title: "Snake Game",
        message: "¡A jugar!",
        player: user.username, // Nombre del jugador (autenticado o "Invitado")
        scores: topScores // Pasar los puntajes a la vista
    });
});

// Ruta POST para registrar un nuevo puntaje

// Obtén el objeto `socket.io` desde el servidor
//const { io } = require('../app');

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

    // Emitir el evento para actualizar las tablas en todos los clientes
    io.emit('actualizar-tabla', topScores);

    res.status(200).json(topScores);

});


// Ruta GET para devolver los puntajes en formato JSON (usado por el cliente)
router.get('/scores', (req, res) => {
    const topScores = scores.getTopScores(); // Obtén los puntajes
    res.status(200).json(topScores); // Devuelve los puntajes al cliente
});

return router; // Asegúrate de devolver el Router
}
//module.exports = router;
