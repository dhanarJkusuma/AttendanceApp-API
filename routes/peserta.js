/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var express = require('express');
var router = express.Router();
var pesertaCtrl = require('../controllers/PesertaController');

module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}), pesertaCtrl.readCtrl);
    router.post('/', passport.authenticate('jwt',{session:false}), pesertaCtrl.createCtrl);
    router.post('/update/:id', passport.authenticate('jwt',{session:false}), pesertaCtrl.updateCtrl);
    router.post('/delete/:id', passport.authenticate('jwt',{session:false}), pesertaCtrl.deleteCtrl);
    return router;
};