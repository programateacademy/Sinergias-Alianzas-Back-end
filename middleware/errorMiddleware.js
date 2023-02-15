/*
todo Se crea middleware para mostrar el código de respuesta en caso de que exista un error en la petición HTTP
*/

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
};

module.exports = errorHandler;
