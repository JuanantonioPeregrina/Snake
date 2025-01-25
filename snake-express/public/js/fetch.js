// Función para enviar el puntaje al servidor
const enviarPuntaje = async (score) => {
    const datos = { user: document.getElementById('player-name').textContent, // Obtén el nombre del jugador desde la página
    score  }; // Cambia "Jugador" según tu lógica
    try {
      const respuesta = await fetch('/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const resultado = await respuesta.text();
      console.log(resultado); // Respuesta del servidor
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };
  
  export { enviarPuntaje };
