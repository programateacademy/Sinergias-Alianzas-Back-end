//Mongoose dependece
const mongoose = require("mongoose");

//Schema
const registerSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: String},
    admin:{
        type:Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    }
});

const Register = mongoose.model("register", registerSchema);

module.exports = Register;
