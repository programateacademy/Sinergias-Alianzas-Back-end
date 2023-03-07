// Import express, mongoose and variables
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// Import Cors, body and cookie parser
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Import file with database connection
const connectDB = require("./mongoDB");

// Importar ruta de usuarios
const userRoute = require("./routes/userRoute");

//Import component routes
const fileComponent = require("./routes/componentRoute");

//Import foro routes
const fileForo = require("./routes/foroRoute");

// Importar middleware
const errorHandler = require("./middleware/errorMiddleware");

// Inicializar el servidor de express
const app = express();

// Puerto de conexión del servidor
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// Usar cors
//! Una vez se realice el despliegue reemplazar -> https://link-despliegue.vercel.app
app.use(
  cors({
    origin: ["http://localhost:3000", "https://link-despliegue.vercel.app"],
    credentials: true,
  })
);

// Endpoints component
app.use("/component", fileComponent);

// Endpoints foro
app.use("/foro", fileForo);

// Endpoints - Módulo usuarios
app.use("/api/users", userRoute);

// Use database connection
connectDB();

// Server connection port
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

// Error Handler - Middleware
app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
