//const Express = require("express");

const { default: mongoose } = require("mongoose");
// Import model Componente

const compModel = require("../models/componentModel");

// Function to create a component

const addComponent = async (request, response) =>{

    const comp = request.body;
    const newComp = new compModel({
        ...comp,
        createdAt: new Date().toISOString(),
    });

    try {
        await newComp.save();
    
        response.status(201).json(newComp);
      } catch (error) {
        response.status(404).json({ messsage: "Algo salió mal" });
      }

};

// Función para listar todas las películas
const getComponents = async (req, res) => {
    try {
      const components = await compModel.find({ visible: true });

      res.status(200).json(components);
    } catch (error) {
      res.status(404).json({ messsage: "Algo salió mal" });
    }
}

// Actualizar información de la película
const updateComponent = async (req, res) => {
    const {id} = req.params
  
    const {
        compTitulo,
        compImgPpal,
        compDefinicion,
        compVideo,
        compDescripcion,
        compImagenes,
        compObjetivos,
        compLineasTrabajo,
        recursos,
        visible,
    } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: `El componente con el id: ${id} no existe` })
      }
      const updatedMovie = {
        compTitulo,
        compImgPpal,
        compDefinicion,
        compVideo,
        compDescripcion,
        compImagenes,
        compObjetivos,
        compLineasTrabajo,
        recursos,
        visible,
      }
  
      await movieModel.findByIdAndUpdate(id, updatedMovie, {new: true})
  
      res.json(updatedMovie)
    } catch (error) {
      res.status(400).json({message: "Algo salió mal"})
    }
  }


exports.addComponent= addComponent;
exports.getComponents = getComponents;
exports.updateComponent = updateComponent;