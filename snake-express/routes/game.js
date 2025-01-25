// Ruta para procesar el puntaje enviado
const express = require('express');
const router = express.Router();

// Importa tu modelo de puntajes
const scores = require('../database/models/score.model'); 


//TAN SOLO PERMITIMOS JUGAR A USUARIOS REGISTRADOS y no a los invitados
router.get('/', (req, res) => {
    // Validar si el usuario está autenticado
    if (!req.session.user || req.session.user.username === "Invitado") {
      req.session.message = "Debes iniciar sesión para jugar.";
      return res.redirect('/login'); // Redirige al login si no está autenticado
    }
    
    const topScores = scores.getTopScores(); // Obtén los puntajes
   
    // Renderiza la página del juego si el usuario está autenticado
    res.render('game', {
      user: req.session.user,
      title: "Snake Game",
      message: "¡A jugar!",
      player: req.session.user.username,
      scores: scores.getTopScores() // Pasamos los puntajes a la vista
    });
  });


// Ruta GET para renderizar la vista del juego si permitimos tanto registrados como invitados
/*router.get('/', (req, res) => {
    // Renderiza game.ejs y pasa datos necesarios como usuario y título
    res.render('game', { 
        user: req.session.user || { username: 'Invitado' }, 
        title: 'Snake Game', 
        message: '¡A jugar!', 
        player: 'Invitado' || user.username 
    });
}); */

// Ruta POST para procesar el puntaje enviado
router.post('/game', (req, res) => {
    const { score } = req.body;
    const username = req.session.user ? req.session.user.username : "Invitado";

    if (!username || !score) {
        return res.status(400).send("Faltan datos.");
    }

    scores.registerScore(username, score); // Registra el puntaje
    const topScores = scores.getTopScores(); // Obtén los mejores puntajes actualizados
    res.status(200).json(topScores); // Devuelve los puntajes actualizados al cliente
});

module.exports = router;