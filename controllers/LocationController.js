/**
 * Created by Dhanar J Kusuma on 16/02/2017.
 */
var Location = require('../models/Location');

exports.createCtrl = function(req, res, next){
    console.log("[Absen API] : Inserting new location.");
    var query = Location.findOne({name: req.body.name});
    var promise = query.exec();
    promise
        .then(function(location){
           if(location){
               return false;
           }
           return true;
        })
        .then(function(result){
            if(result){
                var location = new Location({
                    name : req.body.name
                });
                return location.save();
            }else{
                res.json({
                    status : false,
                    message : "Location name has already exists."
                });
                return null;
            }
        })
        .then(function(location){
            if(location){
                res.json({
                    status : true,
                    data : location,
                    message : "Data location has been successfully inserted."
                })
            }
        })
        .catch(function(err){
            res.json({
                status : false,
                error : err,
                message : "Server Internal Error. (500)"
            })
        });
};

exports.readCtrl = function(req, res, next){
    console.log("[Absen API] : Getting data location.");
    var page = (req.query.page) ? req.query.page : 1 ;
    var limit = (req.query.limit) ? req.query.limit : 10;
    Location.find()
        .sort('name')
        .limit(limit)
        .skip((page-1)*limit)
        .exec(function(err, locations){
            Location.count().exec(function(err, count){
               if(err){return err;}
               res.json({
                   data : locations,
                   totalPage : Math.ceil(count/limit),
                   page : page
               });
            });
        });
};

exports.updateCtrl = function(req, res, next){
    console.log("[Absen API] : Updating location.");
    var id = req.params.id;
    var location = Location.findOne({_id:id});

    location.exec()
        .then(function(location){
            if(location){
                return location;
            }else{
                res.json({
                    status : false,
                    message : "Location not found."
                });
                location.done();
            }
        })
        .then(function(location){
            location.name = req.body.name;
            return location.save();
        })
        .then(function(location){
            res.json({
                status : true,
                data : location,
                message : "Location has been successfully updated."
            })
        })
        .catch(function(err){
            res.json({
                status : false,
                message : "Server Internal Error (500)."
            })
        });
};

exports.deleteCtrl = function(req, res, next){
    console.log("[Absen API] : Deleting location.");
    var id = req.body.id;
    Location.findOneAndRemove({_id: id}, function(err){
        if(err){
            res.json({
                status : false,
                message : "Data that you are deleted is not exists."
            });
        }else {
            res.json({
                status : true,
                message : "Location has been successfully deleted."
            })
        }
    });

};