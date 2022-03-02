var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
    id_sender : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    id_receiver : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    message : String,
    rate : Number,
})

var reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel