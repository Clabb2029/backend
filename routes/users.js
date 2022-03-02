var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/users');

/* GET users listing. avant le prefixe users et ça marchait très bien */
router.post('/signup', async(req, res) => {
  const { 
          pseudo,
          email, 
          password,
          optinEmails,
          guardType,
        } = req.body

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
  const salt = await bcrypt.genSaltSync(10)
  const hashedPassword = await bcrypt.hashSync(password, salt)

  //And then create the user: 
  const user = await userModel.create({
          
          pseudo,
          email, 
          optinEmails,
          guardType,
          password: hashedPassword
  })

  if(user) {

      res.status(201).json(
          {
          _id: user.id,
          pseudo,
          email, 
          optinEmails,
          guardType,
          token: generateToken(user._id)
          }
      )
  
  } else {
          res.status(404)
          throw new Error('Les informations invalides!')
      }
 
});

router.put('/signup-more/:id', async(req, res) => {
  const { 
      livingPlace, 
      petChoice,
      guardType,
    } = req.body


  const userExist = await userModel.findById(req.params.id);
    //check if user exist
    /*if(!userExist) {
        res.status(401)
        throw new Error('User not found')
    }*/

    const updateUser = await userExist.findByIdAndUpdate(req.params.id,
      {
        livingPlace, 
        petChoice,
        guardType}
      , {new: true})
      
    res.status(200).json(updateUser) 
})

router.post('/signin', async (req, res) => {
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
