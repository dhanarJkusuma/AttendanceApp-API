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
                console.log(err);
                res.json({
                    status: false,
                    message: "Something error, Cannot inserting new Participant."
                });
            } else {
                res.json({
                    status: true,
                    message: "Data Participant has been inserted Successfully."
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
        .sort('name')
        .limit(limit)
        .skip((page-1)*limit)
        .exec(function(err, participants){
            Peserta.count().exec(function(err, count){
                if(err){return err;}
                res.json({
                    data : participants,
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

        participant.exec()
            .then(function (peserta) {
                if (peserta) {
                    return peserta;
                } else {
                    res.json({
                        status: false,
                        message: "Participant not found."
                    });
                    return null;
                }
            })
            .then(function (peserta) {
                if (peserta) {
                    var revisi = new PesertaRevisi({
                        nama : peserta.nama,
                        alamat : peserta.alamat,
                        _kloter : peserta._kloter,
                        _location : peserta._location
                    });
                    return {
                        revisi : revisi.save(),
                        peserta : peserta
                    }
                } else {
                    return null;
                }
            })
            .then(function (result) {
                if(result.revisi){
                    peserta.nama = req.body.name;
                    peserta.alamat = req.body.alamat;
                    peserta._kloter = req.body.kloter;
                    peserta._location = req.body.location;
                    peserta._revisi.push(result.revisi._id);
                    return peserta.save();
                }else{
                    return null;
                }
            })
            .then(function(peserta){
                if (peserta) {
                    res.json({
                        status: true,
                        data: peserta,
                        message: "Participant has been successfully updated."
                    })
                } else {
                    res.json({
                        status: false,
                        data : peserta,
                        message: "Error while updating data participant."
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

