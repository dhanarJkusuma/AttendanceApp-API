/**
 * Created by Dhanar J Kusuma on 16/02/2017.
 */
var Location = require('../models/Location');
var Peserta = require('../models/Peserta');
var User = require('../models/User');

exports.createCtrl = function(req, res, next){
    console.log("[Absen API] : Inserting new location.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }else {
        var query = Location.findOne({name: req.body.name});
        var promise = query.exec();
        promise
            .then(function (location) {
                if (location) {
                    return false;
                }
                return true;
            })
            .then(function (result) {
                if (result) {
                    var location = new Location({
                        name: req.body.name
                    });
                    return location.save();
                } else {
                    res.json({
                        status: false,
                        message: "Location name has already exists.",
                        code : 409
                    });
                    return null;
                }
            })
            .then(function (location) {
                if (location) {
                    res.json({
                        status: true,
                        data: location,
                        message: "Data location has been successfully inserted.",
                        code : 201
                    })
                }
            })
            .catch(function (err) {
                res.json({
                    status: false,
                    error: err,
                    message: "Server Internal Error. (500)",
                    code : 500
                })
            });
    }
};

exports.readCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data location.");
    Location.find().exec()
        .then(function(results){
            res.json({
                status : true,
                data : results,
                code : 200
            })
        });
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating location.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }else {
        var id = req.params.id;
        var location = Location.findOne({_id: id});

        location.exec()
            .then(function (location) {
                if (location) {
                    return location;
                } else {
                    res.json({
                        status: false,
                        message: "Location not found.",
                        code : 404
                    });
                    location.done();
                }
            })
            .then(function (location) {
                location.name = req.body.name;
                return location.save();
            })
            .then(function (location) {
                res.json({
                    status: true,
                    data: location,
                    message: "Location has been successfully updated.",
                    code : 200
                })
            })
            .catch(function (err) {
                res.json({
                    status: false,
                    message: "Server Internal Error (500).",
                    code : 500
                })
            });
    }
};

exports.deleteCtrl = function(req, res, next){
    console.log("[Absen API] : Deleting location.");
    if(req.user.level !== 'mypro'){
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }else {
        var id = req.params.id;
        Peserta.findOneAndRemove({ _location: id }, function(err){
            if(!err){
                User.findOneAndRemove({ reps : id}, function(err){
                    if(!err){
                        Location.findOneAndRemove({_id: id}, function (err) {
                            if (err) {
                                res.json({
                                    status: false,
                                    message: "Data that you are deleted is not exists.",
                                    code : 404
                                });
                            } else {
                                res.json({
                                    status: true,
                                    message: "Location has been successfully deleted.",
                                    code : 200
                                })
                            }
                        });
                    }
                });

            }
        });

    }
};