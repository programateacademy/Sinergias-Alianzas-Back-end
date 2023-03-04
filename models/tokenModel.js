// Import mongoose
const mongoose = require("mongoose");

// Estructura del modelo
const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  // Token de verificación
  vToken: {
    type: String,
    default: "",
  },

  // Token para restablecer la contraseña
  rToken: {
    type: String,
    default: "",
  },

  // Token para iniciar sesión
  lToken: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
