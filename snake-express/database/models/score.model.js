const scores = {};

scores.data = []; // Array para almacenar los puntajes

// Registrar un nuevo puntaje
scores.registerScore = function (username, score) {
  scores.data.push({ username, score, date: new Date() });

  // Ordenar los puntajes en orden descendente
  scores.data.sort((a, b) => b.score - a.score);

  // Mantener solo los 10 mejores puntajes
  if (scores.data.length > 10) {
    scores.data = scores.data.slice(0, 10);
  }
};

// Obtener los mejores puntajes
scores.getTopScores = function () {
  return scores.data;
};

module.exports = scores;
