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
                    message : "Username is already exists."
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
                    message : "New User has been registered successfully"
                });
            }
        })
        .catch(function(err){
            res.json({
                status : false,
                err : err,
                message : "Server Internal Error. (500)"
            });
        });
};

exports.readCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data user SH or mypro.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.send('Unauthorized');
    }else {
        User.find({"level": {"$ne": "mypro"}})
            .populate('reps')
            .exec()
            .then(function(results){
                res.json({
                    status : true,
                    data : results
                })
            });
    }
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating data user SH or mypro.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.send('Unauthorized');
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
                        message : "User tidak ditemukan."
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
                        message : "Berhasil mengubah data user."
                    });
                }else{
                    res.json({
                        status : false,
                        message : "Gagal saat mengubah data user."
                    });
                }
            })
            .catch(function(err){
                res.json({
                    status : false,
                    message: "Server Internal Error (500)."
                })
            })
    }
};

exports.changePassCtrl = function(req, res, next){
    console.log("[Absen API] : Change Password user SH or mypro.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.send('Unauthorized');
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
                        message : "User tidak ditemukan."
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
                        message : "Berhasil mengubah password."
                    });
                }else{
                    res.json({
                        status : false,
                        message : "Gagal saat mengubah password."
                    });
                }
            })
            .catch(function(err){
                res.json({
                    status : false,
                    message: "Server Internal Error (500)."
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
                    message: "Data that you are deleted is not exists."
                });
            } else {
                res.json({
                    status: true,
                    message: "Participant has been successfully deleted."
                })
            }
        });
    }else {
        res.status(403);
        res.send('Unauthorized');
    }
};