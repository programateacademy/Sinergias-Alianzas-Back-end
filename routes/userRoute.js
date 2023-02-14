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
  sendEmail,
  timeForgot,
  change,
} = require("../controllers/userController");

// Importar middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

// routes with their respective methods for HTTP requests
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);

// Funciones del administrador
router.patch("/updateUser", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/getUsers", protect, adminOnly, getUsers);




router.post("/sendEmail", sendEmail);
router.get("/timeForgot", timeForgot);
router.post("/change", change);

// Export the file
module.exports = router;
