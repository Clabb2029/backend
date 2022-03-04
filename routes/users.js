var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

const userModel = require('../models/users');

/* GET users listing. avant le prefixe users et ça marchait très bien */
router.post('/signup', async (req, res) => {
const { 
          pseudo,
          email, 
          password,
          optinEmails,
          status,
        } = req.body

        console.log(req.body)
  if(!pseudo || !email || !password) {
      res.status(400)
      throw new Error('Veuillez remplir tous les champs!')
  }

  const userExist = await userModel.findOne({email})
  if(userExist) {
      res.status(400);
      throw new Error('Utisateur déjà existant!')
  }
  //hash password
  var hash = bcrypt.hashSync(password, 10);

  //And then create the user: 
  var newUser = await userModel({
    pseudo : pseudo,
    email : email,
    optinEmails : optinEmails,
    password : hash,
    status : status,
    token: uid2(32),
  })

  var userSaved = await newUser.save();
  if(userSaved) {

      res.status(201).json(
          {
            token : userSaved.token,
            result : true
          }
      )
  
  } else {
          res.status(404)
          throw new Error('Les informations sont invalides!')
      }
 
});

// Route sign-up more avec plus d'infos sur le user:

router.put('/signup-more/:token', async(req, res) => {
  console.log(req.body)
  const { 
    zipcode,
    city,
      livingPlace, 
      petChoice,
      guardType,
    } = req.body


  const userExist = await userModel.find({token: req.params.token});
    //check if user exist
    if(!userExist) {
        res.status(401)
        throw new Error('User not found')
    }

    const updateUser = await userModel.updateOne({token: req.params.token},
      {livingPlace, 
        petChoice,
        guardType,
        $push: { address: {
          zipcode,
          city
        }}
      }
      )
      console.log(updateUser)
      
    res.status(200).json({result: true}) 
})

// Route Signin user :
router.post('/users/signin', async (req, res) => {
  const {email, password} = req.body;

  //check for the user email

  const user = await userModel.findOne({email})

  if(user && (await bcrypt.compare(password, user.password))) {
      res.json({
          _id: user.id,
          email: user.email,
          token: generateToken(user._id)
      })
  } else {
      res.status(404)
      throw new Error('Informations invalides')
  }
  
  res.json({message: 'Login User'})
})

const generateToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "30d",
  })
}
module.exports = router;
