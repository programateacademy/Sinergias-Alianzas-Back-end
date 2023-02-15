// Dependencias
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

/*
- ===========================
-       Enviar email
- ===========================
*/

const sendEmail = async (
  subject,
  send_to,
  send_from,
  reply_to,
  template,
  name,
  link
) => {
  // Crear transportador del correo
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Plantilla del correo
  const handlearOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlearOptions));

  // Opciones para enviar el correo
  const options = {
    from: send_from,
    to: send_to,
    replyTo: reply_to,
    subject,
    template,
    context: {
      name,
      link,
    },
  };

  // Enviar correo
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
