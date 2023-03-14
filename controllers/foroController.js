const { default: mongoose } = require("mongoose");
// Import model Component
const foroModel = require("../models/foroModel");

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

// Function to question list
const getForos = async (req, res) => {
  try {
    const foros = await foroModel.aggregate([
      // Descomponer la matriz de respuestas en documentos separados
      { $unwind: "$answers" },
      // Filtrar solo las respuestas que tengan visible en true
      { $match: { "answers.visible": true } },
      // Volver a agrupar los documentos en la matriz de respuestas
      {
        $group: {
          _id: "$_id",
          id_type: { $first: "$id_type" },
          question: { $first: "$question" },
          author: { $first: "$author" },
          likes: { $first: "$likes" },
          reportNumber: {$first: "$reportNumber"},
          report: {$first: "$report"},
          visible: { $first: "$visible" },
          answers: { $push: "$answers" },
        },
      },
      // Filtrar solo los foros que tengan visible en true
      { $match: { visible: true } },
    ]);
    res.status(200).json(foros);
  } catch (error) {
    res.status(404).json({ messsage: "Algo salió mal" });
  }
};

//get only report filter
const getReports = async (req, res) => {
  try {
    const questions = await foroModel.aggregate([
      {
        $match: {
          report: true,
        },
      },
      {
        $lookup: {
          from: 'forosaludmujers',
          localField: '_id',
          foreignField: 'id_type',
          as: 'answers',
        },
      },
      {
        $project: {
          question: 1,
          author: 1,
          likes: 1,
          reportNumber: 1,
          report: 1,
          visible: 1,
          answers: {
            $filter: {
              input: '$answers',
              as: 'answer',
              cond: {
                $eq: ['$report', true],
              },
            },
          },
        },
      },
    ]);

    const answers = await foroModel.aggregate([
      {
        $unwind: '$answers',
      },
      {
        $match: {
          'answers.report': true,
        },
      },
      {
        $project: {
          _id: 0,
          question: '$question',
          answer: '$answers.description',
          author: '$answers.author',
          likes: '$answers.likes',
          reportNumber: '$answers.reportNumber',
          report: '$answers.report',
          visible: '$answers.visible',
        },
      },
    ]);

    return res.json({
      questions,
      answers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Algo salió mal',
    });
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
  const { _id } = req.body;
  const {
    id_type,
    question,
    author
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ message: `No existe el foro con el: ${_id}` });
    }
    const updatedForo = {
        id_type,
        question,
        author,
        _id: _id,
    };
    await foroModel.findByIdAndUpdate(_id, updatedForo, { new: true });
    res.json(updatedForo);
  } catch (error) {
    res.status(404).json({ message: "No se pudo actualizar el Foro" });
  }
};
//Function to delete component (change visibility)
const deleteForo = async (req, res) => {
  const { _id } = req.body;
  try {
    await foroModel.findOneAndUpdate(
      { _id: _id},
      { visible: false }
    );
    res.json({ msg: "Haz ocultado un Foro" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const updateLikeQuestion = async (req, res) => {
  const { _id,
    likes
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ message: `No existe el foro con el: ${_id}` });
    }
    const updatedLike = {
        likes,
        _id: _id,
    };
    await foroModel.findByIdAndUpdate(_id, updatedLike, { new: true });
    res.json(updatedLike);
  } catch (error) {
    res.status(404).json({ message: "No se pudo actualizar el Foro" });
  }
};

const updateReportQuestion = async (req, res) => {
  const { _id, reportNumber } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ message: `No existe el foro con el: ${_id}` });
    }
    const updatedReport = {
        reportNumber,
        report: true,
        _id: _id,
    };
    await foroModel.findByIdAndUpdate(_id, updatedReport, { new: true });
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
  }
};

//Export every function
exports.addQuestion = addQuestion;
exports.getForos = getForos;
exports.getReports = getReports;
exports.getForo = getForo;
exports.updateForo = updateForo;
exports.deleteForo = deleteForo;
exports.updateLikeQuestion = updateLikeQuestion;
exports.updateReportQuestion = updateReportQuestion;
