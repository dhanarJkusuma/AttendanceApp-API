/**
 * Created by Dhanar J Kusuma on 27/02/2017.
 */

var express = require('express');
var router = express.Router();


module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}));
    return router;
};
