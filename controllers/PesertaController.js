/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var Peserta = require('../models/Peserta');
var PesertaRevisi = require('../models/PesertaRevisi');

exports.createCtrl = function(req, res, next){
    console.log("[Absen API] : Inserting new Participant.");
    if(req.user.level === 'mypro' || req.user.level === 'reps'){
        console.log("passed");
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
                    message: "Gagal menambahkan peserta baru."
                });
            } else {
                res.json({
                    status: true,
                    message: "Berhasil menambahkan peserta baru."
                })
            }
        });
    }else{
        res.status(403);
        res.send('Unauthorized');
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
        .populate('_revisi._kloter')
        .populate('_revisi._location')
        .sort('name')
        .limit(limit)
        .skip((page-1)*limit)
        .exec(function(err, participants){
            Peserta.count().exec(function(err, count){
                if(err){return err;}
                res.json({
                    data : doc3,
                    totalPage : (Math.ceil(count/limit)==0) ? 1 : Math.ceil(count/limit) ,
                    page : page
                });
            });
        });
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating participant.");
    if(req.user.level === 'mypro' || req.user.level === 'reps'){
        var id = req.params.id;
        var participant = Peserta.findOne({_id: id});
        var current_peserta = null;
        participant.exec()
            .then(function (peserta) {
                if (peserta) {
                    return peserta;
                } else {
                    res.json({
                        status: false,
                        message: "Peserta tidak ditemukan."
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
                        message: "Tidak dapat melakukan update, revisi telah melebihi batas maksimal."
                    })
                }
            })
            .then(function(peserta){
                if (peserta) {
                    res.json({
                        status: true,
                        data: peserta,
                        message: "Berhasil mengubah data peserta."
                    })
                } else {
                    res.json({
                        status: false,
                        data : peserta,
                        message: "Gagal mengubah data peserta."
                    })
                }
            })
            .catch(function (err) {
                res.json({
                    status: false,
                    err : err,
                    message: "Server Internal Error (500)."
                })
            });
    }else {
        res.status(403);
        res.send('Unauthorized');
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

