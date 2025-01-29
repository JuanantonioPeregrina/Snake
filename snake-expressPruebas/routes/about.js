const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('about', { user:req.session.user, 
    title: 'About us',   
    message: 'Somos Snake Game',
    player: 'Invitado'});
 }); 


module.exports = router;