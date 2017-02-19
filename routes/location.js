/**
 * Created by Dhanar J Kusuma on 17/02/2017.
 */
var locationCtrl = require('../controllers/LocationController');
var express = require('express');
var router = express.Router();


module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}), locationCtrl.readCtrl);
    router.post('/', passport.authenticate('jwt',{session:false}), locationCtrl.createCtrl);
    router.post('/update/:id', passport.authenticate('jwt',{session:false}), locationCtrl.updateCtrl);
    router.post('/delete/:id', passport.authenticate('jwt',{session:false}), locationCtrl.deleteCtrl);

    return router;
};

