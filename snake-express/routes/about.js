const express = require('express');
const router = express.Router();

app.get('/about', (req, res) => {
    res.render('about', { title: 'About us'          
    ,message: 'Somos Snake Game'
    ,player: 'Invitado'});
 }); 


module.exports = router;