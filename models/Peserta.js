/**
 * Created by Dhanar J Kusuma on 19/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pesertaSchema = new Schema({
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
    ,
    _revisi : [
        {
            type : Schema.Types.ObjectId,
            ref : 'PesertaRevisi',
            required : false
        }
    ]
});

module.exports = mongoose.model('Peserta', pesertaSchema);