// Import express, mongoose and variables 
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Import Cors and morgan 
const cors = require("cors");
const morgan = require("morgan");

// Import file with database connection
const connectDB = require("./mongoDB");

const userRoute = require("./routes/userRoute");

// Initialize the express server
const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Use cors
app.use(cors());

app.use("/users", userRoute);

// Use database connection
connectDB();

// Puerto de conexión del servidor
const PORT = process.env.PORT || 5000;

// Server connection port
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
