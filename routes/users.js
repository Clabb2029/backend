var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

const userModel = require('../models/users');

/* GET users listing. avant le prefixe users et ça marchait très bien */
router.post('/signup', async (req, res) => {
  var error = '';
  var result = false;

  if (req.body.pseudo == '' || req.body.email == '' || req.body.password == '') {
    error = 'Veuillez remplir tous les champs!'
    result = false
  }

  var userExist = await userModel.findOne({ email: req.body.email })
  if (userExist != null) {
    error = "email déjà utilisé";
    result = false
  }

var emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var email = req.body.email
if (emailregex.test(req.body.email) == false )
{ result = false
  error = "Veuillez saisir un email valide ! "}
  //And then create the user: 
  if (userExist == null && req.body.pseudo != '' && req.body.email != '' && req.body.password != '' && emailregex.test(req.body.email) == true ) {

    //hash password
    var hash = bcrypt.hashSync(req.body.password, 10);

    var newUser = await userModel({
      pseudo: req.body.pseudo,
      email: req.body.email,
      optinEmails: req.body.optinEmails,
      password: hash,
      status: req.body.status,
      token: uid2(32),
    })

    var userSaved = await newUser.save();
    result = true
  }
  console.log(result)
  console.log(error)
  res.json(
    {
      error,
      result,
      userSaved
    }
  )
});

// Route sign-up more avec plus d'infos sur le user:

router.put('/signup-more/:token', async (req, res) => {
  console.log(req.body)
  const { zipcode, city, livingPlace, guardType } = req.body

  if (zipcode == '' || city == '') {

    error = 'Veuillez remplir tous les champs!'
    result = false

  } else {

    const userExist = await userModel.find({ token: req.params.token });
    //check if user exist
    if (!userExist) {
      res.status(401)
      throw new Error('User not found')
    } else {
      result = true
      const updateUser = await userModel.updateOne({ token: req.params.token },
        {
          livingPlace,
          guardType,
          $push: {
            address: {
              zipcode,
              city
            }
          }
        }
      )
    }

  }

  res.json({
    error,
    result
  })
})

// Route Signin user :
router.post('/signin', async (req, res) => {
  var error = '';
  var result = false;

  const { email, password } = req.body;

  if (email == '' || password == '') {
    error = 'Veuillez remplir tous les champs!'

    res.json({ error, result })

  } else {
    //check for the user email
    const user = await userModel.findOne({ email })

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        result = true
      } else {
        error = 'Mot de passe incorrect'
      }
    } else {
      error = 'Email non present'
    }

    res.json({ error, result, user })
  }

})


module.exports = router;
