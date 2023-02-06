//Import Express
const express = require("express");

//const router
const router = express.Router();

//import controller
const {signUp} = require("../controllers/registerController");

//rute
router.post('/signUp', signUp)

//export 
module.exports = router;