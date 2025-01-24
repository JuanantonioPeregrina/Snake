const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('restricted', {user: req.session.user, title:"Snake"}); //user: req.session.user es el usuario que se logueó
});

module.exports = router;
