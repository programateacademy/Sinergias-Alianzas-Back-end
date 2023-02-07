// Import dependencies that allow password hashing
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import model
const userModel = require('../models/userModel')

// Key to token
const secret = 'test'

// New user
const signUp = async (req, res) => {
  //values to be inserted into the Users collection
  const {firstName, lastName, email, password} = req.body

  try {
    // Check if the user is already registered
    const oldUser = await userModel.findOne({email})

    if(oldUser) {
      return res.status(400).json({message: 'El usuario ya está registrado'})
    }

    // If the user is not registered
    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await userModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    })

    // token
    const token = jwt.sign({email: result.email, id: result._id}, secret, {expiresIn: '1h'})

    res.status(201).json({result, token})
  } catch (error) {
    res.status(500).json({message: "Algo salió mal"})
    console.log(error)
  }
}

// user input
const signIn = async (req, res) => {
  //values that are required to validate the login to the system
  const {email, password} = req.body

  try {
    // Check if the user is already registered
    const oldUser = await userModel.findOne({email})

    if(!oldUser) return res.status(400).json({message: "El usuario no existe"})

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)

    if(!isPasswordCorrect) return res.status(400).json({message: 'Contraseña incorrecta'})

    // Token
    const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {expiresIn: '1h'})

    res.status(200).json({result: oldUser, token})
  } catch (error) {
    res.status(500).json({message: "Algo salió mal"})
    console.log(error)
  }
}

// Exportar los métodos
exports.signUp = signUp
exports.signIn = signIn