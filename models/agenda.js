var mongoose = require('mongoose');

var agendaSchema = mongoose.Schema({
    id_sender : String,
    id_receiver : String,
    beginning : Date,
    ending : Date,
    status : String
})

var agendaModel = mongoose.model('agenda', agendaSchema);

module.exports = agendaModel