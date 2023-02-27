//const Express = require("express");
const { default: mongoose } = require("mongoose");
// Import model Componente

const compModel = require("../models/componentModel");

// Function to create a component

const addComponent = async (request, response) => {
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

// Función para listar todas los componentes
const getComponents = async (req, res) => {
  try {
    const components = await compModel.find({ visible: true });

    res.status(200).json(components);
  } catch (error) {
    res.status(404).json({ messsage: "Algo salió mal" });
  }
};

//Function get info to the component
const getComponent = async (req, res) => {
  const { id } = req.params;

  try {
    const component = await compModel.findById(id);

    res.status(200).json(component);
  } catch (error) {
    res.status(404).json({ message: "Algo salió mal" });
  }
};

/* // ACTUALIZAR INFORMACIÓN DEL FORMULARIO
  const updateComponent= async (req, res) => {
    try {
      await compModel.findOneAndUpdate(
        { _id: req.params.id }, req.body
      );
      res.json({ msg: "Tu actualización fue satisfactoria" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }; */

// ACTUALIZAR INFORMACIÓN DEL FORMULARIO
const updateComponent = async (req, res) => {
  try {
    await compModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        compTitulo: req.body.compTitulo,        
        compColor: req.body.compColor,
        compImgPpal: req.body.compImgPpal,
        compDefinicion: req.body.compDefinicion,
        compVideo: req.body.compVideo,
        compDescripcion: req.body.compDescripcion,
        compImg1: req.body.compImg1,
        compImg2: req.body.compImg2,
        compImg3: req.body.compImg3,
        compObjetivo1: req.body.compObjetivo1,
        compObjetivo2: req.body.compObjetivo2,
        compObjetivo3: req.body.compObjetivo3,
        compLineaTrabajo1: req.body.compLineaTrabajo1,
        compLineaTrabajo2: req.body.compLineaTrabajo2,
        recursosMetodologia: req.body.recursosMetodologia,
        recursosFormatos: req.body.recursosFormatos,
        recursosDiagnosticos: req.body.recursosDiagnosticos,
        recursosHerramientas: req.body.recursosHerramientas,
        recursosMaterial: req.body.recursosMaterial,
      }
    );
    res.json({ msg: "Tu actualización fue satisfactoria" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//!Working delete
const deleteComponent = async (req, res) => {
  try {
    await compModel.findOneAndUpdate(
      { _id: req.params.id },
      { visible: false }
    );
    res.json({ msg: "Haz eliminado un componente" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// DELETE INFORMACIÓN DEL FORMULARIO

/* const deleteComponent= async (req, res) => {
    try {
      await compModel.findOneAndDelete(
        { _id: req.params.id }
      );
      res.json({ msg: "Haz eliminado un componente" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }; */

exports.addComponent = addComponent;
exports.getComponents = getComponents;
exports.getComponent = getComponent;
exports.updateComponent = updateComponent;
exports.deleteComponent = deleteComponent;
