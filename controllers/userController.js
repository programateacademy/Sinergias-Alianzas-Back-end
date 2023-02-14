// Dependencias
const asyncHandler = require("express-async-handler");
let parser = require("ua-parser-js"); // Agente
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Import dependencies that allow password hashing
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

const keysecret = process.env.SECRET_KEY;

// Import model
const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");

// Importar función para generar el token
const { generateToken, hashToken } = require("../utils");
const sendEmail = require("../utils/sendEmail");
const { use } = require("../routes/userRoute");

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

  // get UserAgent
  /*
   todo Obtener el user-agent permite saber desde que dispositivo se está ingresando o manipulando la información de la base de datos. Se usa como una medida de seguridad. 
   */
  const ua = parser(req.headers["user-agent"]);

  const userAgent = [ua.ua];

  // If the user is not registered
  const newUser = await userModel.create({
    email,
    password,
    name: { firstName, secondName, lastName },
    userAgent,
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
    const { _id, email, rol, isVerify } = newUser;

    res.status(201).json({
      _id,
      name: { firstName, secondName, lastName },
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

/*
- =======================
-   Iniciar sesión
- =======================
*/
// user input
const signIn = asyncHandler(async (req, res) => {
  //values that are required to validate the login to the system
  const { email, password } = req.body;

  //? ¿Todos los campos obligatorios están diligenciados?
  if (!email || !password) {
    res.status(400);
    throw new Error("Por favor, diligencia todos los campos obligatorios");
  }

  // Check if the user is already registered
  const oldUser = await userModel.findOne({ email });

  if (!oldUser) {
    res.status(404);
    throw new Error("El usuario no existe.");
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Contraseña incorrecta");
  }

  // Trigger para user-agent desconocido
  // Token
  const token = generateToken(oldUser._id);

  if (oldUser && isPasswordCorrect) {
    // Enviar HTTP Cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // = 1 día
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, rol, isVerify } = oldUser;

    res.status(200).json({
      _id,
      name,
      email,
      rol,
      isVerify,
      token,
    });
  } else {
    res.status(500);
    throw new Error("Algo salió mal");
  }
});

/*
- ==============================
- Enviar correo de verificación
- ==============================
*/
const sendVerificationEmail = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Correo de verificación");

  const user = await userModel.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  }

  if (user.isVerify) {
    res.status(400);
    throw new Error("Usuario ya verificado.");
  }

  // Eliminar token si existe en la bd
  let token = await tokenModel.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  // Crear token de verificación y guardarlo
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;

  console.log(verificationToken);
  // res.send('token')

  // Hash token y guardarlo
  const hashedToken = hashToken(verificationToken);

  await new tokenModel({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 1 hora
  }).save();

  // Constructor para url de verifiación
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  // Enviar correo de verificación
  const subject = "Verifica tu cuenta - Fundación Sinergias";
  const send_to = user.email;
  const send_from = process.env.EMAIL_USER;
  const reply_to = "noreply@fundacionsinergias.com";
  const template = "verifyEmail";
  const name = `${user.name.firstName} ${user.name.lastName}`;
  const link = verificationUrl;

  try {
    await sendEmail(
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Correo de verificación enviado" });
  } catch (error) {
    res.status(500);
    throw new Error("Correo no enviado. Por favor, intenta de nuevo.");
  }
});

/*
- ==============================
-       Verificar usuario
- ==============================
*/
const verifyUser = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Verificar usuario");

  const { verificationToken } = req.params;

  const hashedToken = hashToken(verificationToken);

  const userToken = await tokenModel.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("El token no es válido o ya expiró");
  }

  // encotnrar el usuario
  const user = await userModel.findOne({ _id: userToken.userId });

  if (user.isVerify) {
    res.status(400);
    throw new Error("El usuario ya fue verificado.");
  }

  // Verificar el usuario
  user.isVerify = true

  await user.save()

  res.status(200).json({message: 'Cuenta verificada correctamente'}) 
});

/*
- =======================
-   Cerrar sesión
- =======================
*/
const logoutUser = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send('Cerrar sesión')

  // Limpiar o eliminar la cookie del navegador
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ message: "Has cerrado sesión" });
});

/*
- =========================
- Obtener usuario logueado
- =========================
*/
const getUser = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Usuario");

  const user = await userModel.findById(req.user._id);

  if (user) {
    const { _id, name, email, rol, isVerify } = user;

    res.status(200).json({
      _id,
      name,
      email,
      rol,
      isVerify,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  }
});

/*
- =========================
- Actualizar usuario
- =========================
*/
const updateUser = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Actualizar usuario");

  const user = await userModel.findById(req.user._id);

  if (user) {
    const { name, email } = user;

    user.email = email;

    user.name = req.body || name;

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      rol: updatedUser.rol,
      isVerify: updatedUser.isVerify,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  }
});

/*
- =========================
- Eliminar usuario
- =========================
*/
const deleteUser = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Usuario eliminado");

  const user = userModel.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("El usuario no existe.");
  }

  await user.remove();

  res.status(200).json({ message: "Usuario eliminado correctamente" });
});

/*
- =========================
- Listar todos los usuarios
- =========================
*/
const getUsers = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Todos los usuarios");

  const users = await userModel.find().sort("-createdAt").select("-password");

  if (!users) {
    res.status(500);
    throw new Error("Algo salió mal");
  }

  res.status(200).json(users);
});

/*
- ===========================
- Verificar inicio de sesión
- ===========================
*/
const loginStatus = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Sesión iniciada");

  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }

  // Verificar el token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }

  return res.json(false);
});

/*
- ===========================
- Cambiar el rol del usuario
- ===========================
*/
const upgradeUser = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Cambio de rol");

  const { rol, id } = req.body;

  const user = await userModel.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  user.rol = rol;

  await user.save();

  res
    .status(200)
    .json({ message: `El rol del usuario ha sido actualizado a: ${rol}` });
});

/*
- ===========================
-  Enviar correo automático
- ===========================
*/
const sendAutomatedEmail = asyncHandler(async (req, res) => {
  //! Test del funcionamiento de la ruta
  // res.send("Enviar correo");

  const { subject, send_to, reply_to, template, url } = req.body;

  if (!subject || !send_to || !reply_to || !template) {
    res.status(500);
    throw new Error("Error en el parámetro del correo");
  }

  // Obtener el usuario
  const user = await userModel.findOne({ email: send_to });

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  const send_from = process.env.EMAIL_USER;
  const name = `${user.name.firstName} ${user.name.lastName}`;
  const link = `${process.env.FRONTEND_URL}${url}`;

  try {
    await sendEmail(
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    res.status(500);
    throw new Error("Correo no enviado. Por favor, intenta de nuevo.");
  }
});

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
module.exports = {
  signUp,
  signIn,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  timeForgot,
  change,
};
