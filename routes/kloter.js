/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var kloterCtrl = require('../controllers/KloterController');
var express = require('express');
var router = express.Router();


module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}), kloterCtrl.readCtrl);
    router.post('/', passport.authenticate('jwt',{session:false}), kloterCtrl.createCtrl);
    router.post('/bykloter', passport.authenticate('jwt', {session:false}), kloterCtrl.readByKloterCtrl);
    router.post('/update/:id', passport.authenticate('jwt',{session:false}), kloterCtrl.updateCtrl);
    router.post('/delete/:id', passport.authenticate('jwt',{session:false}), kloterCtrl.deleteCtrl);

    return router;
};

