// Importar la función enviarPuntaje de fetch.js
import { enviarPuntaje } from './fetch.js'; // Ajusta la ruta si fetch.js está en otra carpeta

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var score = 0; // Variable para el marcador actual

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 10
};

var apple = {
  x: 320,
  y: 320
};

// Actualiza el marcador en la pantalla
function updateScoreDisplay(newScore) {
  document.getElementById('live-score').textContent = newScore;
}

// Obtener un número aleatorio
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Función para actualizar la tabla de puntajes\
const actualizarTabla = async () => {
  try {
    const response = await fetch('/game/scores'); // Llama a la nueva ruta que devuelve los puntajes
    const topScores = await response.json();

    const tbody = document.querySelector("table tbody"); // Selecciona el cuerpo de la tabla
    tbody.innerHTML = ""; // Limpia la tabla antes de agregar los puntajes actualizados

    if (topScores.length > 0) {
      topScores.forEach((score, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${score.username}</td>
          <td>${score.score}</td>
          <td>${new Date(score.date).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No hay puntajes disponibles aún.</td>`;
      tbody.appendChild(row);
    }
  } catch (error) {
    console.error("Error al actualizar la tabla de puntajes:", error);
  }
};

// Loop principal del juego
function loop() {
  requestAnimationFrame(loop);

  if (++count < 8) { //reduce o + la velocidad del juego
    return;
  }
  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // Hacer que la serpiente reaparezca en el lado opuesto si cruza el borde
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Dibujar la manzana
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Dibujar la serpiente
  context.fillStyle = 'green';
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Si la serpiente come la manzana
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++; // Incrementa el marcador
      updateScoreDisplay(score); // Actualiza el marcador en la pantalla
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Si la serpiente colisiona consigo misma
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        enviarPuntaje(score).then(() => {
            actualizarTabla(); // Llama a actualizarTabla después de enviar el puntaje
        });
    
        score = 0; // Reinicia el marcador
        updateScoreDisplay(score); // Actualiza el marcador en la pantalla
    
        // Reinicia el juego
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
    
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    
    }
  });
}

// Control de dirección
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
// Llama a `actualizarTabla` al cargar la página
actualizarTabla();

requestAnimationFrame(loop);
