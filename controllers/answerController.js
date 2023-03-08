const { default: mongoose } = require("mongoose");
// Import model Component
const foroModel = require("../models/foroModel");

const addAnswer = async (req, res) => {
    const { _id } = req.body; // ID de la pregunta
    const { author, description } = req.body; // Autor y descripción de la respuesta
  
    try {
      const foro = await foroModel.findById(_id);
      if (!foro) {
        return res.status(404).json({ message: "No existe el foro" });
      }
  
      // Agregar la respuesta a la lista de respuestas
      const newAnswer = {
        author,
        description,
        delete: false,
        visible: true,
      };
      foro.answers.push(newAnswer);
  
      // Guardar el foro actualizado en la base de datos
      await foro.save();
  
      res.status(201).json(newAnswer);
    } catch (error) {
      res.status(500).json({ message: "Algo salió mal" });
    }
  };
  const updateAnswer = async (req, res) => {
    const { _id } = req.body;
    const { author, description } = req.body;
  
    try {
      const foro = await foroModel.findOneAndUpdate(
        { "answers._id": _id },
        {
          $set: {
            "answers.$.author": author,
            "answers.$.description": description,
          },
        },
        { new: true }
      );
  
      if (!foro) {
        return res.status(404).json({ message: "No se encontró la respuesta" });
      }
  
      res.status(200).json({ message: "Respuesta actualizada exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Algo salió mal" });
    }
  };
  
  
//Export every function
exports.addAnswer = addAnswer;
exports.updateAnswer = updateAnswer;
