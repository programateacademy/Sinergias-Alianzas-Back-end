// Importar express
const express = require("express");

// use the router method of express
const router = express.Router();

// Import methods from the controller
const {signUp, signIn} = require("../controllers/userController");

// routes with their respective methods for HTTP requests
router.post('/signUp', signUp)
router.post('/signIn', signIn)

// Export the file
module.exports = router;
