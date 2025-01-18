const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');
// Crear una instancia de Express
const app = express();


// Definir el puerto ya no hace falta porque se encarga /bin/www
//const PORT = 3000;
// Configurar EJS como el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta donde estarán los archivos .ejs

// Middleware para servir archivos estáticos como estilos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que sirve el archivo index.ejs
app.get('/', (req, res) => {
    res.render('index', { title: 'Snake Game'          
    ,message: 'Bienvenido a Snake Game'
    ,player: 'Jugador'});
 });  

// Ruta principal que sirve el archivo  about.ejs
app.get('/about', (req, res) => {
    res.render('about', { title: 'About us'          
    ,message: 'Somos Snake Game'
    ,player: 'Jugador'});
 });  

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login',message: 'Inicia sesión en Snake Game' }); 
});            
                  
app.get('/restricted', (req, res) => {
    res.render('restricted', { title: 'Página Restringida',message: 'Bienvenido a la zona restringida' });
})

app.use('/', indexRouter);
app.use('/users', userRouter);

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
