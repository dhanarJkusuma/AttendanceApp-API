/**
 * Created by Dhanar J Kusuma on 04/03/2017.
 */
var express = require('express');
var router = express.Router();
var mUserCtrl = require('../controllers/UserController');


module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}), mUserCtrl.readCtrl);
    router.post('/', passport.authenticate('jwt',{session:false}), mUserCtrl.createCtrl);
    router.post('/update/:id', passport.authenticate('jwt',{session:false}), mUserCtrl.updateCtrl);
    router.post('/delete/:id', passport.authenticate('jwt',{session:false}), mUserCtrl.deleteCtrl);

    return router;
};

