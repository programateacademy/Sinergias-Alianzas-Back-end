// Importar express
const express = require("express");

// use the router method of express
const router = express.Router();

// Import methods from the controller
const {
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
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
} = require("../controllers/userController");

// Importar middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

// routes with their respective methods for HTTP requests
// Rutas Generales
router.post("/login", signIn);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/loginStatus", loginStatus);

// Rutas del administrador
router.post("/register", protect, adminOnly, signUp);
router.patch("/updateUser", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/getUsers", protect, adminOnly, getUsers);

router.post("/upgradeUser", protect, adminOnly, upgradeUser);

// Rutas envío de email para verificar usuario y restablecer o cambiar contraseña
router.post("/sendAutomatedEmail", protect, sendAutomatedEmail);
router.post("/sendVerificationEmail", protect, sendVerificationEmail);
router.patch("/verifyUser/:verificationToken", protect, verifyUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", protect, resetPassword);
router.patch("/changePassword", protect, changePassword);
router.post("/sendLoginCode/:email", sendLoginCode);
router.post("/loginWithCode/:email", loginWithCode);

// Export the file
module.exports = router;
