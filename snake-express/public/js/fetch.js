const enviarPuntaje = async (score) => {
  const username = document.getElementById('player-name').textContent;
  const datos = { username, score };

  try {
      console.log("Enviando datos al servidor:", datos);
      const respuesta = await fetch('/game', { // La URL debe coincidir con la ruta en app.js
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
      });

      if (!respuesta.ok) {
          throw new Error(`Error del servidor: ${respuesta.status} ${respuesta.statusText}`);
      }

      const topScores = await respuesta.json();
      console.log("Puntajes recibidos del servidor:", topScores);
      actualizarTabla(topScores); // Actualizar la tabla en el cliente
  } catch (error) {
      console.error("Error al enviar el puntaje:", error);
  }
};

export { enviarPuntaje };

