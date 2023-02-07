//Import dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Import model
const registerModel = require("../models/registerModel");

// Key token
const secret = 'test'

//New user
const signUp = async (req, res) =>{

    const{firstName, lastName, email, password} = req.body

    try{
        const oldUser = await registerModel.findOne({email});

        if(oldUser){
            return res.status(400).json({message: 'El usuario ya  está registrado'})
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await registerModel.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        })

        const token = jwt.sign({email: result.email, id: result._id}, secret, {expiresIn: '1h'})

        res.status(201).json({result, token})
    }catch (error){
        res.status(500).json({message: "Algo salió mal"})
        console.log(error)
    }
}

//export method
exports.signUp = signUp;