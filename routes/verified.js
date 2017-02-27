/**
 * Created by Dhanar J Kusuma on 27/02/2017.
 */

var express = require('express');
var router = express.Router();


module.exports = function(passport){
    router.get('/', passport.authenticate('jwt',{session:false}), function(req, res, next){

        var promise = User.findOne({ _id: req.user.id});
        promise.exec()
            .then(function(user){
                if(user){
                    user.validatePassword(password, function(err, isMatch){
                        if(err){
                            return err;
                        }
                        if(isMatch && !err){
                            var token = jwt.sign(user, config.secret, {
                                expiresIn : 10800 //in second
                            });
                            res.json({
                                status : true,
                                message : "Login successfully.",
                                token : 'JWT ' + token
                            })
                        }else{
                            res.json({
                                status : false,
                                message : "Invalid password"
                            })
                        }
                    });
                }else{
                    res.json({
                        status : false,
                        message : "User not found."
                    })
                }
            })
            .catch(function(err){
                res.json({
                    status :false,
                    message : "Server Internal Error (500)."
                })
            });
    });
    return router;
};
