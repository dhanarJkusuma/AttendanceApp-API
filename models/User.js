/**
 * Created by Dhanar J Kusuma on 15/02/2017.
 */
var mongoose = require('mongoose');
//windows
var bcrypt = require('bcrypt-nodejs');
//linux || UNIX
//var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;


var userSchema = new Schema({
   'username' : {
       type : String,
       required : true,
       unique : true
   },
   'password' : {
       type : String,
       required : true
   },
   'level' : {
       type : String,
       enum : ['reps', 'sh', 'mypro'],
       required : true
   },
   'reps' : {
       type : Schema.Types.ObjectId,
       ref: 'Location',
       required : false
   }
});


userSchema.pre('save', function(next){
   var user = this;
   if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, function(err, salt){
           if(err){return next(err);}
           bcrypt.hash(user.password, salt, null, function(err, hash){
              if(err){return next(err);}
              user.password = hash;
              next();
           });
        });
   }else{
       return next();
   }
});

userSchema.methods.validatePassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, isMatch){
     if(err){
         return callback(err);
     }
     callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);