/**
 * Created by Dhanar J Kusuma on 04/03/2017.
 */

var User = require('../models/User');

//CRUD USER
//Crete new User
exports.createCtrl = function(req, res, next){
    console.log("[Absen API] : Registering new user SH or mypro.");
    var userIsExist = User.findOne({username:req.body.username});
    userIsExist.exec()
        .then(function(user){
            if(user){
                res.json({
                    status : false,
                    message : "Username is already exists.",
                    code : 409
                });
                return null;
            }else{
                var user = new User({
                    username : req.body.username,
                    password : req.body.password,
                    level : req.body.level,
                    reps : (req.body.reps != null && req.body.reps != '' && req.body.level == 'reps') ? req.body.reps : null
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
                    message : "New User has been registered successfully",
                    code : 201
                });
            }
        })
        .catch(function(err){
            res.json({
                status : false,
                err : err,
                message : "Server Internal Error. (500)",
                code : 500
            });
        });
};

exports.readCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data user SH or mypro.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }else {
        User.find({"level": {"$ne": "mypro"}})
            .populate('reps')
            .exec()
            .then(function(results){
                res.json({
                    status : true,
                    data : results,
                    code : 200
                })
            });
    }
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating data user SH or mypro.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }else {
        var username = req.body.username;
        var level = req.body.level;
        var _reps = (req.body.reps != null && req.body.reps != ''  && req.body.level == 'reps') ? req.body.reps : null;
        var findUser = User.findOne({_id : req.params.id});
        findUser.exec()
            .then(function(user){
                if(user){
                    return user;
                }else{
                    res.json({
                        status : false,
                        message : "User tidak ditemukan.",
                        code : 404
                    });
                    return null;
                }
            })
            .then(function(result){
                if(result){
                    result.username = username;
                    result.level = level;
                    result.reps = _reps;
                    return result.save();
                }else{
                    return null;
                }
            })
            .then(function(result){
                if(result){
                    res.json({
                        status : true,
                        data : result,
                        message : "Berhasil mengubah data user.",
                        code : 200
                    });
                }else{
                    res.json({
                        status : false,
                        message : "Gagal saat mengubah data user.",
                        code : 409
                    });
                }
            })
            .catch(function(err){
                res.json({
                    status : false,
                    message: "Server Internal Error (500).",
                    code : 500
                })
            })
    }
};

exports.changePassCtrl = function(req, res, next){
    console.log("[Absen API] : Change Password user SH or mypro.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }else {
        var password = req.body.password;
        var findUser = User.findOne({_id : req.params.id});
        findUser.exec()
            .then(function(user){
                if(user){
                    return user;
                }else{
                    res.json({
                        status : false,
                        message : "User tidak ditemukan.",
                        code : 404
                    });
                    return null;
                }
            })
            .then(function(result){
                if(result){
                    result.password = password;
                    return result.save();
                }else{
                    return null;
                }
            })
            .then(function(result){
                if(result){
                    res.json({
                        status : true,
                        message : "Berhasil mengubah password.",
                        code : 200
                    });
                }else{
                    res.json({
                        status : false,
                        message : "Gagal saat mengubah password.",
                        code : 409
                    });
                }
            })
            .catch(function(err){
                res.json({
                    status : false,
                    err : err,
                    message: "Server Internal Error (500).",
                    code : 500
                })
            })
    }
};

exports.deleteCtrl = function(req, res, next){
    console.log("[Absen API] : Deleting data user SH or mypro.");
    if(req.user.level === 'mypro'){
        var id = req.params.id;
        User.findOneAndRemove({_id: id}, function (err) {
            if (err) {
                res.json({
                    status: false,
                    message: "Data that you are deleted is not exists.",
                    code : 404
                });
            } else {
                res.json({
                    status: true,
                    message: "Participant has been successfully deleted.",
                    code : 200
                })
            }
        });
    }else {
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }
};