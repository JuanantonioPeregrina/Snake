/*
// Importar la función enviarPuntaje de fetch.js
import { enviarPuntaje } from './fetch.js'; // Ajusta la ruta si fetch.js está en otra carpeta
//import { io } from "socket.io-client"; // Importa el cliente de WebSocket
//import { io } from "/js/socket.io-client/socket.io.js";
// Configurar WebSocket
const socket = io(); // Conecta al servidor de WebSockets

// Escuchar el evento `actualizar-tabla` desde el servidor
socket.on('actualizar-tabla', (topScores) => {
    console.log("Puntajes recibidos a través de WebSocket:", topScores);
    actualizarTabla(topScores); // Llama a la función para actualizar la tabla
});

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
export const actualizarTabla = async () => {
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
*/

// Importar la función enviarPuntaje de fetch.js
import { enviarPuntaje } from './fetch.js';
const socket = io(); // Conecta al servidor de WebSockets

socket.on('actualizar-tabla', (topScores) => {
    console.log("Puntajes recibidos a través de WebSocket:", topScores);
    actualizarTabla(topScores);
});

// Definir el tamaño del tablero
const gridSize = 10; // 10x10 celdas
const cellSize = 40; // Cada celda mide 40 píxeles

// Configurar el canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

// Variables del juego
var count = 0;
var score = 0; // Marcador actual

// Configuración de la serpiente
var snake = {
  x: 5, // Posición inicial en la cuadrícula
  y: 5,
  dx: 1, // Movimiento en la cuadrícula
  dy: 0,
  cells: [],
  maxCells: 4
};

// Manzana (se genera en una celda aleatoria)
let apple = { x: 0, y: 0 };

// Función para actualizar la posición de la manzana
function updateApplePosition() {
  apple.x = Math.floor(Math.random() * gridSize);
  apple.y = Math.floor(Math.random() * gridSize);
}

// Dibujar la manzana
function drawApple() {
  context.fillStyle = 'red';
  context.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize - 1, cellSize - 1);
}

// Comprobar si la serpiente ha comido la manzana
function checkAppleCollision(snakeHead) {
  if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
    snake.maxCells++; // La serpiente crece
    score++; // Sumar puntaje
    updateScoreDisplay(score);
    updateApplePosition();
  }
}

// Actualiza el marcador en la pantalla
function updateScoreDisplay(newScore) {
  document.getElementById('live-score').textContent = newScore;
}

// **Bucle principal del juego**
function loop() {
  requestAnimationFrame(loop);

  if (++count < 10) return; // Controla la velocidad del juego
  count = 0;

  // Limpiar el canvas antes de redibujar
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Mover la serpiente
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Evitar que la serpiente salga del tablero (se teletransporta al otro lado)
  if (snake.x < 0) snake.x = gridSize - 1;
  else if (snake.x >= gridSize) snake.x = 0;

  if (snake.y < 0) snake.y = gridSize - 1;
  else if (snake.y >= gridSize) snake.y = 0;

  // Insertar nueva posición en la lista de celdas de la serpiente
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Eliminar la cola si es más larga de lo permitido
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  drawApple(); // Dibujar la manzana

  // Dibujar la serpiente
  context.fillStyle = 'green';
  snake.cells.forEach((cell, index) => {
    context.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize - 1, cellSize - 1);

    checkAppleCollision(cell); // Verificar colisión con la manzana

    // Si la serpiente se muerde a sí misma
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        enviarPuntaje(score).then(() => {
          actualizarTabla();
        });

        // Reiniciar juego
        score = 0;
        updateScoreDisplay(score);
        snake.x = 5;
        snake.y = 5;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = 1;
        snake.dy = 0;

        updateApplePosition();
      }
    }
  });
}

// **Actualizar la posición inicial de la manzana**
updateApplePosition();

// **Eventos de teclado para mover la serpiente**
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -1;
    snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -1;
    snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = 1;
    snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = 1;
    snake.dx = 0;
  }
});

// **Iniciar el juego**
actualizarTabla();
requestAnimationFrame(loop);
export function actualizarTabla() {
  console.log("Actualizando tabla...");
  // Aquí se puede agregar la lógica para actualizar la tabla si es necesario.
}
