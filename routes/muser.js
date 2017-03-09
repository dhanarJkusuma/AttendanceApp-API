/**
 * Created by Dhanar J Kusuma on 04/03/2017.
 */
var express = require('express');
var router = express.Router();
var mUserCtrl = require('../controllers/UserController');
var authCtrl = require('../controllers/AuthController');

module.exports = function(passport){
    router.get('/', authCtrl.authenticate(passport), mUserCtrl.readCtrl);
    router.post('/', authCtrl.authenticate(passport), mUserCtrl.createCtrl);
    router.post('/update/:id', authCtrl.authenticate(passport), mUserCtrl.updateCtrl);
    router.post('/delete/:id', authCtrl.authenticate(passport), mUserCtrl.deleteCtrl);
    router.post('/password/:id', authCtrl.authenticate(passport), mUserCtrl.changePassCtrl);
    return router;
};

