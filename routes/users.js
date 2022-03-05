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

  var userExist = await userModel.findOne({ email : req.body.email })
  if (userExist != null) {
    error = "email déjà utilisé";
    result = false
  }
  //hash password
  var hash = bcrypt.hashSync(req.body.password, 10);

  //And then create the user: 
  if (userExist == null && req.body.pseudo!= '' && req.body.email != '' && req.body.password!= '') {
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
  const {
    zipcode,
    city,
    livingPlace,
    guardType,
  } = req.body


  const userExist = await userModel.find({ token: req.params.token });
  //check if user exist
  if (!userExist) {
    res.status(401)
    throw new Error('User not found')
  }

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
  console.log(updateUser)

  res.status(200).json({ result: true })
})

// Route Signin user :
router.post('/users/signin', async (req, res) => {
  const { email, password } = req.body;

  //check for the user email

  const user = await userModel.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(404)
    throw new Error('Informations invalides')
  }

  res.json({ message: 'Login User' })
})

const generateToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "30d",
  })
}
module.exports = router;
