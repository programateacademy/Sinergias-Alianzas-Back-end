//Mongoose dependece
const mongoose = require("mongoose");

//Schema
const registerSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: String},
    rol:{
        type:Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    }
});

const Register = mongoose.model("Form", registerSchema);

module.exports = Register;
