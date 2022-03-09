var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    sender : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    message : String,
    timestamp : Date,
    read : Boolean,
})


var conversationSchema = mongoose.Schema({
    id_user1: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    id_user2: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    message : [messageSchema]
})

var conversationModel = mongoose.model('conversations', conversationSchema);

module.exports = conversationModel