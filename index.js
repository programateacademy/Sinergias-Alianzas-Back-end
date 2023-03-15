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

// Importar middleware
const errorHandler = require("./middleware/errorMiddleware");
const Componente = require("./models/componentModel");

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

app.use("/component", require('./routes/componentRoute'));

// Endpoints - Módulo usuarios
app.use("/api/users", require('./routes/userRoute'));

app.use('/foroRoute', require('./routes/foroRoute'))

app.use('/answerRoute', require('./routes/answerRoute'))

// Use database connection
connectDB();



// Error Handler - Middleware
app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
