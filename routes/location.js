/**
 * Created by Dhanar J Kusuma on 17/02/2017.
 */
var locationCtrl = require('../controllers/LocationController');
var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/AuthController');

module.exports = function(passport){
    router.get('/', authCtrl.authenticate(passport), locationCtrl.readCtrl);
    router.post('/', authCtrl.authenticate(passport), locationCtrl.createCtrl);
    router.post('/update/:id', authCtrl.authenticate(passport), locationCtrl.updateCtrl);
    router.post('/delete/:id', authCtrl.authenticate(passport), locationCtrl.deleteCtrl);

    return router;
};

