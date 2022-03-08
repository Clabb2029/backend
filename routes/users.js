var express = require('express');
var router = express.Router();
var request = require('sync-request')
const dotenv = require('dotenv').config();

//Pour générer un token :
var uid2 = require('uid2')
// Pour crypter le mot de passe
var bcrypt = require('bcrypt');

// Pour l'upload et le stockage des images
const uniqid = require('uniqid');
const fs = require('fs');


var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

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
  if (emailregex.test(req.body.email) == false) {
    result = false
    error = "Veuillez saisir un email valide ! "
  }
  //And then create the user: 
  if (userExist == null && req.body.pseudo != '' && req.body.email != '' && req.body.password != '' && emailregex.test(req.body.email) == true) {

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
  res.json(
    {
      error,
      result,
      userSaved
    }
  )
});

// Route sign-up more avec plus d'infos sur le user:

router.post('/signup-more/:token', async (req, res) => {
  var error = '';
  var result = false;

  var userData = JSON.parse(req.body.userInfo)

  if (userData.zipcode == '' || userData.city == '') {

    error = 'Veuillez remplir tous les champs!'

  } else {

    var userExist = await userModel.findOne({ token: req.params.token });
    //check if user exist
    if (!userExist) {
      error = 'Utilisateur pas trouvé';

    } else {
      userExist.livingPlace = userData.livingPlace
      userExist.guardType = userData.guardType
      userExist.address.push({ zipcode: userData.zipcode, city: userData.city })

      // Si le user n'existe pas on va envoyer l'image dans un fichier temporaire
      var imagePath = './tmp/' + uniqid() + '.jpg';

      var resultCopy = await req.files.image.mv(imagePath);

      // Puis envoyer l'image sur Cloudinary et récupérer l'url dans la bdd
      if (!resultCopy) {
        var resultCloudinary = await cloudinary.uploader.upload(imagePath, {folder: 'petfriends'});
        userExist.avatar = resultCloudinary.url
      // On sauvegarde ensuite le user mis à jour avec les dernières infos  
        var userUpdated = await userExist.save()

        if (userUpdated) {
          result = true

        } else {
          error = "user pas mis à jour"
        }
      }
      else {
        error = "fichier non transféré"
      }
    }

    res.json({ result, error })
   
    fs.unlinkSync(imagePath)

  }

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
