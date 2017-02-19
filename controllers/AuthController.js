/**
 * Created by Dhanar J Kusuma on 15/02/2017.
 */
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/main');

exports.register = function(req, res, next){
    console.log("[Absen API] : Registering new user.");
    var userIsExist = User.findOne({username:req.body.username});
    userIsExist.exec()
        .then(function(user){
            if(user){
                res.json({
                    status : false,
                    message : "Username is already exists."
                });
                return null;
            }else{
                var user = new User({
                    username : req.body.username,
                    password : req.body.password,
                    level : req.body.level,
                    reps : [

                    ]
                });
                return user.save();
            }
        })
        .then(function(user){
            if(user){
                res.json({
                    status : true,
                    user : {
                        username : user.username,
                        level : user.level,
                        reps : user.reps
                    },
                    message : "New User has been registered successfully"
                });
            }
        })
        .catch(function(err){
            res.json({
                status : false,
                message : "Server Internal Error. (500)"
            });
        });
};

exports.login = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    var promise = User.findOne({ username: username});
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
}