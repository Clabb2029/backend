var express = require('express')
const userModel = require('../models/users');
const agendaModel = require('../models/agenda')
const reviewModel = require('../models/reviews')
const conversationModel = require('../models/conversations')

var router = express.Router();
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// Création d'un compte 

router.post('/signup', async function(req, res, next) {
  // var token = req.body.token;
  // var pseudo = req.body.pseudo;
  // var email = req.body.email;
  // var password = req.body.password

  var newUser = await userModel({
    address: {
      zipcode : req.body.zipcode,
      city : req.body.city,
      latitude : req.body.latitude,
      longitude : req.body.longitude
    },
  pseudo : req.body.pseudo,
  email : req.body.email,
  optinEmails : req.body.optinEmails,
  password : req.body.password,
  avatar : req.body.avatar,
  livingPlace : req.body.livingPlace,
  status : req.body.status,
  petChoice : [req.body.petChoice],
  description : req.body.description,
  guardType : req.body.guardType,
  })

  var userSaved = await newUser.save();

  res.json({result:true, userSaved})


  // if (!token || !pseudo || !email || !password) {
  //   res.json({result: false})
  // } else {
  //   res.json({result: true})
  // }
});


// Connection
router.post('/signin', function(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  if(!email || !password){
    res.json({result: false})
  } else {
    res.json({result: true, user: [{
      pseudo: 'clara',
      token: 12
    }] })
  }
})

// Récuperation des profils users pour l'affichage sur ProfilScreen : 
router.get('/users/:userID', async function(req, res, next) {

  var userid = await userModel.findById(req.params.userID)
  
  if(userid){
    var userReviews = await userModel.findById(req.params.userID).populate('reviews').exec();
    var reviewSender = await reviewModel.find({id_receiver: req.params.userID}).populate('id_sender').exec();

    res.json({userInfo : userReviews, reviews: userReviews.reviews, reviewSender})

  } else {
    res.json({result: false})
  }
})

// Récupération des positions des users
router.get('/users-position', async function(req, res, next){

  // var users = await userModel.find({
  //   latitude: req.query.latitude,
  //   longitude: req.query.longitude
  // })

  var usersOwner = await userModel.find({
    status: false
  })

  if(!usersOwner){
    res.json({result: false})
  } else {
    res.json({result: true, usersOwner})
  }
 
})


// Ajout d'un favoris
router.post('/add-favorite/:token', async function(req, res, next){
 
  result = false
  error = ''
  favoriteExist = false

  console.log(req.body)
  var user = await userModel.findOne({token : req.params.token})

  console.log(user)
  for (var i = 0; i<user.favoriteUsers.length; i++){
    if (user.favoriteUsers[i].id_user === req.body.id_user){
      favoriteExist = true
    }}
if (favoriteExist == true){
  error = 'Utilisateur déjà en favoris !'
  result = false
} else {
      user.favoriteUsers.push({
        id_user : req.body.id_user,
        pseudo : req.body.pseudo,
        avatar : req.body.avatar
      })
      var userUpdated = user.save()
      if (userUpdated){
        result = true
      }
    }
 
 
  res.json({result, error})
})

// Suppression d'un favoris
router.delete('/delete-favorite/:token/:favoriteID', async function(req, res, next){
let result = false;
    //Recherche du user
  var userExist = await userModel.findOne({token: req.params.token})
  if (userExist){
    // mise à jour du profil avec la suppression du favoris
  var userUpdate =  await userModel.updateOne({token : req.params.token},
      {$pull : {favoriteUsers :
      { _id : req.params.favoriteID}
    },
  })
  console.log(userUpdate)
    }
    // Si la mise à jour s'est bien faite, on récupère les infos du user à jour
  if (userUpdate.modifiedCount == 1){
    result = true;
    userUpdate = await userModel.findOne({token: req.params.token})
  }


  res.json({result, favoriteUpdate: userUpdate.favoriteUsers})
})

// Récupération des favoris
router.get('/favorites/:token', async function(req, res, next){

var userFavorites = await userModel.findOne({token : req.params.token}) 

  res.json({favoris: userFavorites.favoriteUsers})
})

// Récupération des conversations
router.get('/conversations/:userID', async function(req, res, next){

  var currentUserID = req.params.userID

  // Je cherche à avoir le modèle de notre utilisateur avec ses conversations qui s'affichent dans le tableau
  var currentUser = await userModel.findById(currentUserID).populate('conversations').exec();
  var currentUserConversations = currentUser.conversations

  // console.log("id de l'user actuel : ", currentUser._id)
  // console.log("liste des conversations de l'user : ", currentUserConversations)

  // Je veux récupérer les ID des autres en comparant mon ID à ceux dans les conversations, 
  // mais le if ne fonctionne pas, donc ça push mon ID dans le tableau qui doit recevoir ceux des autres
  var otherUsers = []

  for (var i=0 ; i<currentUserConversations.length ; i++){

    // console.log("user 1 :", currentUserConversations[i].id_user1, "user 2 : ", currentUserConversations[i].id_user2)

    if (currentUserConversations[i].id_user1 != currentUser._id) {
      otherUsers.push(currentUserConversations[i].id_user1)
    
    } else if (currentUserConversations[i].id_user2 != currentUser._id) {
    otherUsers.push(currentUserConversations[i].id_user2)
    }
  }

  // Ce log affiche donc le tableau mal rempli ...
  // console.log("tableau des ID des autres utilisateurs : ", otherUsers)

  res.json({otherUsers})
})

// Suppression d'une conversation 
router.delete('/delete-conversation', function(req, res, next){
  res.json()

})

// Récupération d'un chat pour afficher les messages entre 2 users
router.get('/chat', function(req, res, next){
  res.json()
})

// Envoi d'un message
router.post('/send-message', async function (req, res, next){

  console.log(req.body);
  const { id_sender, id_receiver, message, createdAt, read } = req.body
 
  var conversationExists = await conversationModel.find({id_user1: id_sender, id_user2: id_receiver})
  var conversationExists1 = await conversationModel.find({id_user1: id_receiver, id_user2: id_sender})
  var sender = await userModel.findById(id_sender)
  var receiver = await userModel.findById(id_receiver)

  console.log("conversation exists : ", conversationExists)
  console.log("conversation exists 1 : ", conversationExists1)


  if (conversationExists.length === 0 && conversationExists1.length === 0 ) {
    var newConversation = await conversationModel ({
      id_user1: id_sender, 
      id_user2: id_receiver,
      message: [
        {
          sender : id_sender,
          message : message,
          timestamp : createdAt,
          read : read
        }
      ]    
    })

    var newConversationSaved = await newConversation.save() 

    sender.conversations.push(newConversationSaved)
    var senderSave = sender.save()

    receiver.conversations.push(newConversationSaved)
    var receiverSave = receiver.save()

    console.log("voici la nouvelle conversation : ", newConversationSaved)
    res.json({result: true})


  } else if (conversationExists.length > 0){

    console.log("conversation exists : ", conversationExists)

    conversationExists[0].message.push(
      {
        sender : id_sender,
          message : message,
          timestamp : createdAt,
          read : read
      }
    )

    await conversationExists[0].save()
    console.log("voici la liste de messages mise à jour : ", conversationExists)
    res.json({result: true})

  } else if (conversationExists1.length > 0){

    console.log("conversation exists : ", conversationExists1)

    conversationExists1[0].message.push(
      {
        sender : id_sender,
          message : message,
          timestamp : createdAt,
          read : read
      }
    )

    await conversationExists1[0].save()
    console.log("voici la liste de messages mise à jour : ", conversationExists1)
    res.json({result: true})  
  }
})

// Récupération de l'agenda
router.get('/agenda/:token', async function(req, res, next){
  var userExist = await userModel.findOne({token : req.params.token})

  if(userExist){
    var userAgenda = await agendaModel.find({id_receiver: userExist._id }).populate('id_sender').exec();
    res.json({ result: true, agendaInfo:userAgenda})
  } else {
    res.json({result: false})  }
})

// Modification de l'agenda
router.put('/agenda/', async function(req, res, next){

  agenda = await agendaModel.updateOne(
    {_id : req.body.id},
    {status: req.body.status})

    agendaUpdate = await agendaModel.findById(req.body.id).populate('id_sender').exec();

    if(agenda.acknowledged == true){
      res.json({result:true, agendaUpdate })
    } else {
      res.json({result: false})
    }
  
})

// Ajouter un rendez-vous
router.post('/add-date', async function(req, res, next){
  var sitter = await userModel.findById(req.body.receiverid)
  var owner = await userModel.findById(req.body.senderid)

  var newDate = await agendaModel({
    id_sender : req.body.senderid,
    id_receiver : req.body.receiverid,
    beginning : req.body.beginningdate,
    ending : req.body.endingdate,
    status : req.body.status
  })
  var newDateSaved = await newDate.save()

  sitter.agenda.push(newDateSaved.id)
  var sitterSaved = sitter.save()
  owner.agenda.push(newDateSaved.id)
  var ownerSaved = owner.save()
  res.json({result:true, newDate, ownerSaved, sitterSaved})
})

// Ecrire une review
router.post('/add-review', async function(req, res, next){

 var user = await userModel.findById(req.body.id_receiver)

 var newReview = await reviewModel ({
  id_sender : req.body.id_sender,
  id_receiver : req.body.id_receiver,
  message : req.body.message,
  rate : req.body.rate,
})
var reviewSaved =  await newReview.save()

  user.reviews.push(reviewSaved.id)
  var userSaved = user.save();
  res.json({result:true, reviewSaved, userSaved})
})


module.exports = router;
