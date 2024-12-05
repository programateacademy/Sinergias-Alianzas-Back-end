const { default: mongoose } = require("mongoose");
// Import model Component
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

// Function to list components
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

// Function to update the data of the component
const updateComponent = async (req, res) => {
  const { id } = req.params;
  const {
    compTitulo,
    compColor,
    compImgPpal,
    compDefinicion,
    compVideo,
    compDescripcion,
    compImg1,
    compImg2,
    compImg3,
    compObjetivo1,
    compObjetivo2,
    compObjetivo3,
    compLineaTrabajo1,
    compLineaTrabajo2,
    recursosMetodologia,
    recursosFormatos,
    recursosDiagnosticos,
    recursosHerramientas,
    recursosMaterial,
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No existe el componente con el: ${id}` });
    }
    const updatedComponent = {
      compTitulo,
      compColor,
      compImgPpal,
      compDefinicion,
      compVideo,
      compDescripcion,
      compImg1,
      compImg2,
      compImg3,
      compObjetivo1,
      compObjetivo2,
      compObjetivo3,
      compLineaTrabajo1,
      compLineaTrabajo2,
      recursosMetodologia,
      recursosFormatos,
      recursosDiagnosticos,
      recursosHerramientas,
      recursosMaterial,
      _id: id,
    };
    await compModel.findByIdAndUpdate(id, updatedComponent, { new: true });
    res.json(updatedComponent);
  } catch (error) {
    res.status(404).json({ message: "No se pudo actualizar el componente" });
  }
};

//Function to delete component (change visibility)
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
//Export every function
exports.addComponent = addComponent;
exports.getComponents = getComponents;
exports.getComponent = getComponent;
exports.updateComponent = updateComponent;
exports.deleteComponent = deleteComponent;
