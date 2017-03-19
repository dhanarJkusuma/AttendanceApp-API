/**
 * Created by Dhanar J Kusuma on 09/03/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pesertaRevisi = new Schema({
    nama : {
        type : String,
        required : true
    },
    alamat : {
        type : String,
        required : true
    },
    _kloter : {
        type : Schema.Types.ObjectId,
        ref : 'Kloter',
        required : true
    },
    _location : {
        type : Schema.Types.ObjectId,
        ref : 'Location',
        required : true
    }
});

module.exports = mongoose.model('PesertaRevisi', pesertaRevisi);