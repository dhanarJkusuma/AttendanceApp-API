/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var kloterCtrl = require('../controllers/KloterController');
var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/AuthController');

module.exports = function(passport){



    router.get('/', authCtrl.authenticate(passport), kloterCtrl.readCtrl);
    router.post('/', authCtrl.authenticate(passport), kloterCtrl.createCtrl);
    router.post('/update/:id', authCtrl.authenticate(passport), kloterCtrl.updateCtrl);
    router.post('/delete/:id', authCtrl.authenticate(passport), kloterCtrl.deleteCtrl);

    return router;
};

