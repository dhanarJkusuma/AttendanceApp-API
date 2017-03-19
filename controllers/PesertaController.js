/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var Peserta = require('../models/Peserta');
var PesertaRevisi = require('../models/PesertaRevisi');
var json2csv = require('json2csv');

exports.createCtrl = function(req, res, next){
    console.log("[Absen API] : Inserting new Participant.");
    console.log(req.user.username);
    console.log(req.user.level);
    if(req.user.level === 'mypro' || req.user.level === 'reps'){
        var peserta = new Peserta({
            nama: req.body.name,
            alamat: req.body.alamat,
            _kloter: req.body.kloter,
            _location : req.body.location,
            _revisi : []
        });
        peserta.save(function (err) {
            if (err) {
                res.json({
                    status: false,
                    message: "Gagal menambahkan peserta baru.",
                    code : 409
                });
            } else {
                res.json({
                    status: true,
                    message: "Berhasil menambahkan peserta baru.",
                    code : 201

                })
            }
        });
    }else{
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }
};

exports.readCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data participant.");
    var page = (req.query.page) ? req.query.page : 1 ;
    var limit = (req.query.limit) ? req.query.limit : 10;
    Peserta.find()
        .populate('_location')
        .populate('_kloter')
        .populate('_revisi')
        .sort('name')
        .limit(limit)
        .skip((page-1)*limit)
        .exec(function(err, participants){
            if(err){return err;}
            Peserta.count().exec(function(err, count){
                Peserta.populate(participants, { path: '_revisi._kloter', model : 'Kloter' }, function(err, participantsKl){
                    if(err){return err;}
                    Peserta.populate(participantsKl, { path: '_revisi._location', model : 'Location' }, function(err, participantsLoc){
                       if(err){return err;}
                       res.json({
                           data : participantsLoc,
                           totalPage : (Math.ceil(count/limit)==0) ? 1 : Math.ceil(count/limit) ,
                           page : page,
                           code : 200
                       });
                   });
                });

            });
        });
};

exports.readByKloterCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data participant.");
    var page = (req.query.page) ? req.query.page : 1 ;
    var limit = (req.query.limit) ? req.query.limit : 10;
    Peserta.find({ _kloter : req.body.kloter, _location : req.body.location })
        .populate('_location')
        .populate('_kloter')
        .populate('_revisi')
        .sort('name')
        .limit(limit)
        .skip((page-1)*limit)
        .exec(function(err, participants){
            if(err){return err;}
            Peserta.count().exec(function(err, count){
                Peserta.populate(participants, { path: '_revisi._kloter', model : 'Kloter' }, function(err, participantsKl){
                    if(err){return err;}
                    Peserta.populate(participantsKl, { path: '_revisi._location', model : 'Location' }, function(err, participantsLoc){
                        if(err){return err;}
                        res.json({
                            data : participantsLoc,
                            totalPage : (Math.ceil(count/limit)==0) ? 1 : Math.ceil(count/limit) ,
                            page : page,
                            code : 200
                        });
                    });
                });

            });
        });
};

exports.exportToExcel = function(req, res, next){
    console.log("[Absen API] : Getting data participant.");
    Peserta.find({ _kloter : req.body.kloter, _location : req.body.location })
        .populate('_location','name')
        .populate('_kloter','name')
        .populate('_revisi')
        .sort('name')
        .exec(function(err, participants){
            if(err){return err;}
            res.json({
                status: true,
                data : participants
            })
        });
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating participant.");
    if(req.user.level === 'mypro' || req.user.level === 'reps'){
        var id = req.params.id;
        var participant = Peserta
            .findOne({_id: id})
            .populate('_location')
            .populate('_kloter')
            .populate('_revisi');
        var current_peserta = null;
        participant.exec()
            .then(function (peserta) {
                if (peserta) {
                    return peserta;
                } else {
                    res.json({
                        status: false,
                        message: "Peserta tidak ditemukan.",
                        code : 404
                    });
                    return null;
                }
            })
            .then(function (peserta) {
                if (peserta && peserta._revisi.length <3) {
                    current_peserta = peserta;
                    var revisi = new PesertaRevisi({
                        nama : peserta.nama,
                        alamat : peserta.alamat,
                        _kloter : peserta._kloter,
                        _location : peserta._location
                    });
                    return revisi.save();
                } else {
                    return null;
                }
            })
            .then(function (revisi) {
                if(revisi){
                    current_peserta.nama = req.body.name;
                    current_peserta.alamat = req.body.alamat;
                    current_peserta._kloter = req.body.kloter;
                    current_peserta._location = req.body.location;
                    current_peserta._revisi.push(revisi._id);
                    return current_peserta.save();
                }else{
                    res.json({
                        status: false,
                        message: "Tidak dapat melakukan update, revisi telah melebihi batas maksimal.",
                        code : 200
                    })
                }
            })
            .then(function(peserta){
                Peserta.populate(current_peserta, {
                    path: '_revisi._kloter',
                    model : 'Kloter' },
                    function(err, participantsKl) {
                        if (err) {
                            return err;
                        }
                    Peserta.populate(participantsKl, {
                        path: '_revisi._location',
                        model: 'Location'
                    }, function (err, participantsLoc) {
                            if (err) {
                                return err;
                            }
                            if (peserta) {
                                res.json({
                                    status: true,
                                    data: participantsLoc,
                                    message: "Berhasil mengubah data peserta.",
                                    code : 200
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: "Gagal mengubah data peserta.",
                                    code : 409
                                })
                            }
                    });
                });
            })
            .catch(function (err) {
                res.json({
                    status: false,
                    err : err,
                    message: "Server Internal Error (500).",
                    code : 500
                })
            });
    }else {
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }
};

exports.deleteCtrl = function(req, res, next){
    console.log("[Absen API] : Deleting participant.");
    if(req.user.level !== 'mypro' || req.user.level !== 'reps'){
        var id = req.params.id;
        Peserta.findOneAndRemove({_id: id}, function (err) {
            if (err) {
                res.json({
                    status: false,
                    message: "Peserta tidak ditemukan.",
                    code : 404
                });
            } else {
                res.json({
                    status: true,
                    message: "Berhasil menghapus data peserta.",
                    code : 200
                })
            }
        });
    }else {
        res.status(403);
        res.json({status : false, message : "Unauthorized", code: 403});
    }
};

