// Import mongoose
const mongoose = require("mongoose");

// Code the password with bcrypt
const bcrypt = require("bcryptjs");

// Define the structure of the model
const userSchema = mongoose.Schema(
  {
    name: {
      firstName: String,
      secondName: String,
      lastName: String,
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
    },
    rol: {
      type: String,
      required: true,
      default: "Colaborador",
      // More roles: Admin, suspendido,
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

// Code the pasword before save on the Bd
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Code the password with 10 characters
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});
// variable that will contain the model to be able to export
const User = mongoose.model("User", userSchema);
module.exports = User;
