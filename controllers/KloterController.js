/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */

var Kloter = require('../models/Kloter');

exports.createCtrl = function(req, res, next){
    console.log("[Absen API] : Inserting new Kloter.");
    console.log(req.body.name);
    if(req.user.level !== 'mypro'){
        res.json({
            status : false,
            message : "Unauthorized",
            code : 403
        });
    }else{
        var query = Kloter.findOne({name: req.body.name});
        var promise = query.exec();
        promise
            .then(function(kloter){
                if(kloter){
                    return false;
                }
                return true;
            })
            .then(function(result){
                if(result){
                    var kloter = new Kloter({
                        name : req.body.name
                    });
                    return kloter.save();
                }else{
                    res.json({
                        status : false,
                        message : "Kloter name has already exists.",
                        code : 409
                    });
                    return null;
                }
            })
            .then(function(kloter){
                if(kloter){
                    res.json({
                        status : true,
                        data : kloter,
                        message : "Data kloter has successfully inserted.",
                        code : 201
                    })
                }
            })
            .catch(function(err){
                res.json({
                    status : false,
                    error : err,
                    message : "Server Internal Error. (500)",
                    code : 500
                })
            });
    }

};

exports.readCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data kloter.");
    Kloter.find().exec()
        .then(function(results){
           res.json({
               status : true,
               data : results,
               code : 200
           })
        });
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating kloter.");
    if(req.user.level !== 'mypro'){
        res.json({
            status : false,
            message : "Unauthorized.",
            code : 403
        })
    }else{
        var id = req.params.id;
        var kloter = Kloter.findOne({_id:id});
        kloter.exec()
            .then(function(kloter){
                if(kloter){
                    return kloter;
                }else{
                    res.json({
                        status : false,
                        message : "Kloter not found.",
                        code : 404
                    });
                    return null;
                }
            })
            .then(function(kloter){
                if(kloter){
                    kloter.name = req.body.name;
                    return kloter.save();
                }
            })
            .then(function(kloter){
                res.json({
                    status : true,
                    data : kloter,
                    message : "Kloter has been successfully updated.",
                    code : 200
                })
            })
            .catch(function(err){
                res.json({
                    status : false,
                    err : err,
                    message : "Server Internal Error (500).",
                    code : 500
                })
            });
    }
};

exports.deleteCtrl = function(req, res, next){
    console.log("[Absen API] : Deleting kloter.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.send('Unauthorized');
    }else {
        var id = req.params.id;
        Kloter.findOneAndRemove({_id: id}, function (err) {
            if (err) {
                res.json({
                    status: false,
                    message: "Data that you are deleted is not exists.",
                    code : 404
                });
            } else {
                res.json({
                    status: true,
                    message: "Kloter has been successfully deleted.",
                    code : 200
                })
            }
        });
    }
};