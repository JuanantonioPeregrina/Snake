// Ruta para procesar el puntaje enviado
const express = require('express');
const app = express();

app.use(express.json()); // Middleware para procesar JSON

app.post('/game/score', (req, res) => {
    const { user, score } = req.body;

    // Validar datos
    if (!user || !score) {
        return res.status(400).send("Faltan datos.");
    }

    console.log(`Usuario: ${user}, Puntaje: ${score}`);
    res.send("Puntaje procesado correctamente.");
});
