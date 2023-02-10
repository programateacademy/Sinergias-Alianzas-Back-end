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

//Import component routes
const fileComponent = require("./routes/componentRoute");


// Inicializar el servidor de express
const app = express();

//Middleware
const userRoute = require("./routes/userRoute");


app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Usar cors
app.use(cors());

// Endpoints component
app.use("/component", fileComponent);

//Endpoint user

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


