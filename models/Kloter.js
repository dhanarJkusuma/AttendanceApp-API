/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Peserta = require('./Peserta');

var kloterSchema = new Schema({
    name : {
        type: String,
        required : true,
        unique : true
    }
});

kloterSchema.pre('remove', function(next){
    Peserta.remove({_kloter : this._id});
    next();
});

module.exports = mongoose.model('Kloter', kloterSchema);