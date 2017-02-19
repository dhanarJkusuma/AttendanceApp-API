var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/AuthController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);


module.exports = router;
