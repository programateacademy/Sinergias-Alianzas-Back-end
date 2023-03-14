const { default: mongoose } = require("mongoose");
// Import model Component
const foroModel = require("../models/foroModel");

// Function to create a component
const addQuestion = async (request, response) => {
  const { id } = request.params
  const foro = request.body;
  const newForo = new foroModel({
    ...foro,
    createdAt: new Date().toISOString(),
    id_type: id
  });
  try {
    await newForo.save();
    response.status(201).json(newForo);
  } catch (error) {
    response.status(404).json({ messsage: "Algo salió mal" });
  }
};

//Function get info to the component
const getForo = async (req, res) => {
  const { id } = req.params;
  try {
    // const foro = await foroModel.find({id_type: id,visible: true, answers: {$exists: true }});
    // res.status(200).json(foro);
    const filtro = { visible: true, id_type: id};
    const foros = await foroModel.find(filtro);

    // Agregar un objeto de filtro a la función find() para buscar sólo respuestas con visible=true
    foros.forEach((foro) => {
      foro.answers = foro.answers.filter((answer) => answer.visible);
    });

    // Si no hay respuestas en el documento, mantener el documento en la lista
    const forosSinRespuestas = foros.filter((foro) => foro.answers.length === 0);
    const forosConRespuestas = foros.filter((foro) => foro.answers.length > 0);

    // Ordenar los foros con respuestas por fecha de última respuesta
    forosConRespuestas.sort((a, b) => {
      const fechaUltimaRespuestaA = new Date(a.answers[a.answers.length - 1].createdAt);
      const fechaUltimaRespuestaB = new Date(b.answers[b.answers.length - 1].createdAt);
      return fechaUltimaRespuestaB - fechaUltimaRespuestaA;
    });

    // Concatenar los foros con y sin respuestas para mostrarlos en orden
    const resultado = forosConRespuestas.concat(forosSinRespuestas);

    res.json(resultado);
  } catch (error) {
    res.status(404).json({ message: "Algo salió mal" });
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
exports.getReports = getReports;
exports.getForo = getForo;
exports.updateForo = updateForo;
exports.deleteForo = deleteForo;
exports.updateLikeQuestion = updateLikeQuestion;
exports.updateReportQuestion = updateReportQuestion;
