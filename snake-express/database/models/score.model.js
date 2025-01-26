const scores = {
  data: [],

  registerScore(username, score) {
      const date = new Date().toISOString();
      this.data.push({ username, score, date });

      // Ordenar por puntaje de mayor a menor
      this.data.sort((a, b) => b.score - a.score);

      // Limitar a los 10 mejores puntajes
      this.data = this.data.slice(0, 10);
  },

  getTopScores() {
      return this.data;
  }
};

module.exports = scores;
