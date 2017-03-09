/**
 * Created by Dhanar J Kusuma on 27/02/2017.
 */

var express = require('express');
var router = express.Router();
var auth = require('../controllers/AuthController');
var authCtrl = require('../controllers/AuthController');
module.exports = function(passport){
    router.get('/', authCtrl.authenticate(passport), auth.verified);
    return router;
};
