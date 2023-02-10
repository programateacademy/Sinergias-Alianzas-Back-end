// Importar express, mongoose y variables de entorno
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Importar Cors para las peticiones HTTP
const cors = require("cors");
const morgan = require("morgan");

// Importar archivo con la conexión de la base de datos
const connectDB = require("./mongoDB");

// ------------------------------Parte Andrea
//Import component routes
const fileComponent = require("./routes/componentRoute");

// ------------------------------Fin parte Andrea

// Inicializar el servidor de express
const app = express();

// ------------------------------Parte Andrea
//Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Usar cors
app.use(cors());

// Endpoints component
app.use("/component", fileComponent);


// ------------------------------Fin parte Andrea

// Usar conexión de la base de datos
connectDB();

// Puerto de conexión del servidor
const PORT = process.env.PORT || 5000;

// Conexión del servidor
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});


