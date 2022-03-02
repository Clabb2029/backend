var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
    id_sender : String,
    pseudo_sender : String,
    id_receiver : String,
    message : String,
    rate : Number,
})

var reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel