var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    senderName : String,
    message : String,
    timestamp : Date,
    read : Boolean,
})

var conversationSchema = mongoose.Schema({
    id_sender : String,
    id_receiver : String,
    message : [messageSchema]
})

var conversationModel = mongoose.model('conversations', conversationSchema);

module.exports = conversationModel