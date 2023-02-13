// Import express, mongoose and variables
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Import Cors, body and cookie parser
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Import file with database connection
const connectDB = require("./mongoDB");

const userRoute = require("./routes/userRoute");

// Initialize the express server
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// Use cors
//! Una vez se realice el despliegue reemplazar -> https://link-despliegue.vercel.app
app.use(
  cors({
    origin: ["http://localhost:3000", "https://link-despliegue.vercel.app"],
    credentials: true,
  })
);

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
