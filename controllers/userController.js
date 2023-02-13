// Dependencias
const asyncHandler = require("express-async-handler");

// Import dependencies that allow password hashing
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

const keysecret = process.env.SECRET_KEY;

// Import model
const userModel = require("../models/userModel");

// Importar función para generar el token
const { generateToken } = require("../utils");

/*
- =======================
-   Registrar usuario
- =======================
*/
// New user
const signUp = asyncHandler(async (req, res) => {
  //values to be inserted into the Users collection - Credenciales del usuario
  const { firstName, secondName, lastName, email, password } = req.body;

  //? ¿Los campos obligatorios están diligenciados?
  if (!firstName || !lastName || !email || !password) {
    res.status(400);

    throw new Error("Por favor, diligencia todos los campos obligatorios");
  }

  //? ¿La contraseña tiene mínimo 8 caracteres?
  if (password.length < 8) {
    res.status(400);

    throw new Error("La contraseña debe ser mínimo de 8 caracteres");
  }

  // Check if the user is already registered
  const oldUser = await userModel.findOne({ email });

  if (oldUser) {
    res.status(400);

    throw new Error("El usuario ya está registrado");
  }

  // If the user is not registered
  const newUser = await userModel.create({
    email,
    password,
    name: `${firstName} ${secondName} ${lastName}`,
  });

  // Generar token
  const token = generateToken(newUser._id);

  // Enviar HTTP Cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // = 1 día
    sameSite: "none",
    secure: true,
  });

  if (newUser) {
    const { _id, name, email, rol, isVerify } = newUser;

    res.status(201).json({
      _id,
      name,
      email,
      rol,
      isVerify,
      token,
    });
  } else {
    res.status(400);

    throw new Error("Error en la información del usuario");
  }
});

// user input
const signIn = async (req, res) => {
  //values that are required to validate the login to the system
  const { email, password } = req.body;

  try {
    // Check if the user is already registered
    const oldUser = await userModel.findOne({ email });

    if (!oldUser)
      return res.status(400).json({ message: "El usuario no existe" });

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Token
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
    console.log(error);
  }
};

//email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

//send email link for reset password
const sendEmail = async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Escribe tu correo" });
  }
  try {
    const userFind = await userModel.findOne({ email: email });

    //token generate for reset password
    const token = jwt.sign({ _id: userFind._id }, keysecret, {
      expiresIn: "1h",
    });
    const setUserToken = await userModel.findByIdAndUpdate(
      { _id: userFind._id },
      { verify_token: token },
      { new: true }
    );

    if (setUserToken) {
      const mailOptions = {
        from: "",
        to: email,
        subject: "Enviando correo para recuperar la contraseña",
        text: `Esta link es valido por 2 minutos http://localhost/3000/${userFind.id}/${setUserToken.verify_token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({ status: 401, message: "Correo no enviado" });
        } else {
          console.log("Correo enviado", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Correo enviado correctamente" });
        }
      });
    }
  } catch (err) {
    res.status(401).json({ status: 401, message: "Usuario invalido" });
  }
};

//verify user for forgot password time
const timeForgot = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validUser = await userModel.findOne({ _id: id, verify_token: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (validUser && verifyToken._id) {
      res.status(201).json({ status: 201, validUser });
    } else {
      res.status(401).json({ status: 401, message: "El usuario no existe" });
    }
  } catch (err) {
    res.status(401).json({ status: 401, err });
  }
};

//change password
const change = async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;

  try {
    const validUser = await userModel.findOne({ _id: id, verify_token: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (validUser && verifyToken._id) {
      const newPassword = await bcrypt.hash(password, 12);

      const setNewUserPass = await userModel.findByIdAndUpdate(
        { _is: id },
        { password: newPassword }
      );

      setNewUserPass.save();
      res.status(201).json({ status: 201, setNewUserPass });
    } else {
      res.status(401).json({ status: 401, message: "El usuario no existe" });
    }
  } catch (err) {
    res.status(401).json({ status: 401, err });
  }
};

// Export methods
exports.signUp = signUp;
exports.signIn = signIn;
exports.sendEmail = sendEmail;
exports.timeForgot = timeForgot;
exports.change = change;
