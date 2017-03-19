/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var express = require('express');
var router = express.Router();
var pesertaCtrl = require('../controllers/PesertaController');
var authCtrl = require('../controllers/AuthController');

module.exports = function(passport){
    router.get('/', authCtrl.authenticate(passport), pesertaCtrl.readCtrl);
    router.post('/', authCtrl.authenticate(passport), pesertaCtrl.createCtrl);
    router.post('/bykloter', authCtrl.authenticate(passport), pesertaCtrl.readByKloterCtrl);
    router.post('/update/:id', authCtrl.authenticate(passport), pesertaCtrl.updateCtrl);
    router.post('/delete/:id', authCtrl.authenticate(passport), pesertaCtrl.deleteCtrl);
    router.post('/export', authCtrl.authenticate(passport), pesertaCtrl.exportToExcel);
    return router;
};