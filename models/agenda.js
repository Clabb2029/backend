var mongoose = require('mongoose');

var agendaSchema = mongoose.Schema({
    id_sender : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    id_receiver : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    beginning : Date,
    ending : Date,
    status : String
})

var agendaModel = mongoose.model('agenda', agendaSchema);

module.exports = agendaModel