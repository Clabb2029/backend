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


module.exports = router;
