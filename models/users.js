var mongoose = require('mongoose');

var adressSchema = mongoose.Schema({
    zipcode : String,
    city : String,
    latitude : Number,
    longitude : Number
})

var favoriteSchema = mongoose.Schema({
    id_user : String,
    pseudo : String,
    avatar : String
})

var userSchema = mongoose.Schema({
    token : String,
    pseudo : String,
    email : String,
    optinEmails : Boolean,
    password : String,
    avatar : String,
    address : [adressSchema],
    livingPlace : Boolean,
    status : Boolean,
    petChoice : [String],
    description : String,
    guardType : Boolean,
    availabilityStart : Date,
    availabilityEnd : Date,
    photos : [String],
    conversations : [{type: mongoose.Schema.Types.ObjectId, ref:'conversations'}],
    favoriteUsers : [favoriteSchema],
    reviews :  [{type: mongoose.Schema.Types.ObjectId, ref:'reviews'}],
    agenda :  [{type: mongoose.Schema.Types.ObjectId, ref:'agenda'}]
})


var userModel = mongoose.model('users', userSchema);

module.exports = userModel