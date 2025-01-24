const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session'); // Si usas sesiones


const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');
const loginRouter = require('./routes/login'); // Ajusta la ruta según la ubicación de tu archivo
const restrictedRouter = require('./routes/restricted');

// Crear una instancia de Express
const app = express();

// Definir el puerto ya no hace falta porque se encarga /bin/www
//const PORT = 3000;



// Configurar EJS como el motor de vistas

app.set('views', path.join(__dirname, 'views')); // Carpeta donde estarán los archivos .ejs
app.set('view engine', 'ejs');
// Middleware para servir archivos estáticos como estilos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Para manejar JSON
app.use(express.urlencoded({ extended: false })); // Para manejar datos del formulario
app.use(session({ // Configuración de la sesión (Guardar datos de usuario en el servidor)
  secret: "Una frase muy secreta",
  resave: false,
  saveUninitialized: true
}));
app.use((req, res, next) => {
  const message = req.session.message; // Obtiene el mensaje de la sesión
  const error = req.session.error; // Obtiene el error de la sesión

  delete req.session.message; // Elimina el mensaje de la sesión
  delete req.session.error; // Elimina el error de la sesión

  res.locals.message = ""; // Inicializa el mensaje local como vacío
  res.locals.error = ""; // Inicializa el error local como vacío

  if (message) res.locals.message = `<p>${message}</p>`; // Si hay mensaje, lo formatea como HTML
  if (error) res.locals.error = `<p>${error}</p>`; // Si hay error, lo formatea como HTML

  next(); // Continúa con el siguiente middleware o ruta
});


//routes
app.use('/', indexRouter);
app.use('/login', loginRouter);

app.use('/game', gameRouter);
app.use('/restricted', restricted, restrictedRouter); //middleware en una funcion aparte
//Se define sin ninguna ruta(solo en el server)
app.use('/logout', (req,res) =>{
  req.session.destroy(); //destruye el id de sesión y manda a la página principal
  res.redirect("/");
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || { username: "Invitado" }; // Si no hay usuario, muestra "Invitado"
  next();
});



function restricted(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect("login");
  }
}
// Exportar la aplicación
module.exports = app;

// Iniciar el servidor
/*app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});*/
