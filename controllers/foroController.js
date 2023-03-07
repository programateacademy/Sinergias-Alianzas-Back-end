const { default: mongoose } = require("mongoose");
// Import model Component
const foroModel = require("../model/foroModel.js");

// Function to create a component
const addQuestion = async (request, response) => {
  const foro = request.body;
  const newForo = new foroModel({
    ...foro,
    createdAt: new Date().toISOString(),
  });
  try {
    await newForo.save();
    response.status(201).json(newForo);
  } catch (error) {
    response.status(404).json({ messsage: "Algo salió mal" });
  }
};

// Function to list components
const getForos = async (req, res) => {
  try {
    const foros = await foroModel.find({ visible: true });
    res.status(200).json(foros);
  } catch (error) {
    res.status(404).json({ messsage: "Algo salió mal" });
  }
};

//Function get info to the component
const getForo = async (req, res) => {
  const { id } = req.params;
  try {
    const foro = await foroModel.findById(id);
    res.status(200).json(foro);
  } catch (error) {
    res.status(404).json({ message: "Algo salió mal" });
  }
};

// Function to update the data of the component
const updateForo = async (req, res) => {
  const { id } = req.params;
  const {
    id_type,
    question,
    author
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No existe el foro con el: ${id}` });
    }
    const updatedForo = {
        id_type,
        question,
        author,
        _id: id,
    };
    await foroModel.findByIdAndUpdate(id, updatedForo, { new: true });
    res.json(updatedForo);
  } catch (error) {
    res.status(404).json({ message: "No se pudo actualizar el Foro" });
  }
};

//Function to delete component (change visibility)
const deleteForo = async (req, res) => {
  try {
    await foroModel.findOneAndUpdate(
      { _id: req.params.id },
      { visible: false }
    );
    res.json({ msg: "Haz eliminado un Foro" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
//Export every function
exports.addQuestion = addQuestion;
exports.getForos = getForos;
exports.getForo = getForo;
exports.updateForo = updateForo;
exports.deleteForo = deleteForo;
