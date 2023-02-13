// Importar jsonwebtoken
const jwt = require("jsonwebtoken");

/*
- =======================
-   Generar Token
- =======================
*/
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = {
  generateToken,
};
