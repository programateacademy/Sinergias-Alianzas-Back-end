// Import mongoose
const mongoose = require("mongoose");

// Define the structure of the model
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor ingresa el nombre"],
    },

    email: {
      type: String,
      required: [true, "Por favor ingresa el correo"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Ingresa un correo válido",
      ],
    },

    password: {
      type: String,
      required: [true, "Por favor ingresa la contraseña"],
      minlength: 8,
    },

    rol: {
      type: String,
      required: true,
      default: "Colaborador",
      // Otros roles: Admin, suspendido,
    },

    isVerify: {
      type: Boolean,
      default: false,
    },

    userAgent: {
      type: Array,
      required: true,
      default: [],
    },
  },

  {
    timestamps: true,
    minimize: false,
  }
);

// variable that will contain the model to be able to export
const User = mongoose.model("User", userSchema);

module.exports = User;
