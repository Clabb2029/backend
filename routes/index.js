var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// Création d'un compte 

router.post('/signup', function(req, res, next) {
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

// Récuperation des profils users
router.get('/users', function(req, res, next) {
  var id = req.query.id;

  if(!id){
    res.json({result: false})
  } else {
    res.json({result: true, user: [{
      pseudo: 'loulou',
      description: 'coucou !'
    }]})
  }
})

// Récupération des positions des users
router.get('/users-position', function(req, res, next){
  res.json()
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
router.post('/add-review', function(req, res, next){
  res.json()
})


module.exports = router;
