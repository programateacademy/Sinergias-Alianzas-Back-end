//* Import mongoose to work with DB.
const mongoose = require("mongoose");
/*
 * ======================================
 *      DB Conection
 * ======================================
 */

//* Import dotenv, node js package for config the envirionment variables
const dotenv = require("dotenv");
dotenv.config();
mongoose.set('strictQuery', false);
//* Se crea la conexión de la base de datos

const connectDB = () => {
  // Connection method
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // State of DB connection
  mongoose.connection.on("connected", () => {
    console.log("Base de datos conectada");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Base de datos desconectada");
  });

  mongoose.connection.on("error", () => {
    console.log("Error al conectar la base de datos", error.message);
  });
};

module.exports = connectDB;
