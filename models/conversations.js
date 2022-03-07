var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    sender : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    message : String,
    timestamp : Date,
    read : Boolean,
})

var participantsSchema = mongoose.Schema({
    user1 : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    user2: {type: mongoose.Schema.Types.ObjectId, ref:'users'}
})

var conversationSchema = mongoose.Schema({
    participants: [participantsSchema],
    message : [messageSchema]
})

var conversationModel = mongoose.model('conversations', conversationSchema);

module.exports = conversationModel