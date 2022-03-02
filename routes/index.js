var express = require('express');
const userModel = require('../models/users');
const agendaModel = require('../models/agenda')
const reviewModel = require('../models/reviews')
var router = express.Router();
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/users');
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// Création d'un compte 

router.post('/signup', async function(req, res, next) {
  var token = req.body.token;
  var pseudo = req.body.pseudo;
  var email = req.body.email;
  var password = req.body.password

  if (!token || !pseudo || !email || !password) {
    res.json({result: false})
  } else {
    res.json({result: true})
  }
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
    res.json({userInfo : userReviews, reviews: userReviews.reviews})
    console.log(userReviews)
  } else {
    res.json({result: false})
  }
})

// Récupération des positions des users
router.get('/users-position', async function(req, res, next){

  var users = await userModel.find({
    latitude: req.query.latitude,
    longitude: req.query.longitude
  })

  if(!users){
    res.json({result: false})
  } else {
    res.json({result: true, users})
  }
 
})

// Récupération des notes 
router.get('/rate', function(req, res, next){
  res.json()
})

// Ajout d'un favoris
router.post('/add-favorite', function(req, res, next){
  res.json()
})

// Suppression d'un favoris
router.delete('/delete-favorite/', function(req, res, next){
  res.json()
})

// Récupération des favoris
router.get('/favorites', function(req, res, next){
  res.json()
})

// Récupération des conversations
router.get('/conversations', function(req, res, next){
  res.json()
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
router.post('/send-message', function(req, res, next){
  res.json()
})

// Récupération de l'agenda
router.get('/agenda', function(req, res, next){
  res.json()
})

// Ajouter un rendez-vous
router.post('/add-date', function(req, res, next){
  res.json()
})

// Modifier info d'un user 
router.put('/settings', function(req, res, next){
  res.json()
})

// Ecrire une review
router.post('/add-review', async function(req, res, next){

 var user = await userModel.findById(req.body.receiverid)

 var newReview = await reviewModel ({
  id_sender : req.body.senderid,
  pseudo_sender : req.body.pseudo,
  id_receiver : req.body.receiverid,
  message : req.body.message,
  rate : req.body.rate,
})
var reviewSaved =  await newReview.save()
  user.reviews.push(reviewSaved.id)
  var userSaved = user.save();

  res.json({result:true, newReview, userSaved})
})


module.exports = router;
