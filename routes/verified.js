/**
 * Created by Dhanar J Kusuma on 27/02/2017.
 */

var express = require('express');
var router = express.Router();
var auth = require('../controllers/AuthController');

module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}), auth.verified);
    return router;
};
