// Dependencias
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Importar modelo
const userModel = require("../models/userModel");

// Función para proteger la ruta
const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Acceso denegado. Inicia sesión.");
    }

    // Verificar token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener el id del usuario desde el token
    const user = await userModel.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }

    // Verificar el rol del usuario
    if (user.rol === "suspendido") {
      res.status(400);
      throw new Error("Usuario suspendido. Contacta con el administrador.");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Acceso denegado. Inicia sesión.");
  }
});

const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.rol === "Administrador") {
    next();
  } else {
    res.status(401);
    throw new Error("Acceso denegado. Solo administrador.");
  }
});

const authorOnly = asyncHandler(async (req, res, next) => {
  if (req.user.rol === "Colaborador" || req.user.rol === "Administrador") {
    next();
  } else {
    res.status(401);
    throw new Error("Acceso denegado. Solo colaborador.");
  }
});

const verifiedOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerify) {
    next();
  } else {
    res.status(401);
    throw new Error("Acceso denegado. Cuenta no verificada.");
  }
});

module.exports = {
  protect,
  adminOnly,
  authorOnly,
  verifiedOnly,
};
