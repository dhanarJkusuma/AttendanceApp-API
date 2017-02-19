/**
 * Created by Dhanar J Kusuma on 15/02/2017.
 */
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var User = require('../models/User');
var config = require('./main');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJWT.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JWTStrategy(opts, function(payload, done){
        User.findOne({_id : payload._doc._id}, function(err, user){
           if(err){
               return done(err, false);
           }
           if(user){
               done(null, user);
           }else{
               done(null, false);
           }
        });
    }));
};

