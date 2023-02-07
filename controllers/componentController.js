const Express = require("express");

// Import model Componente

import Componente from "../models/componentModel";

// Function to create a component

const addComponent = async (request, response) =>{
    try{
        const newComponent = await Componente.create({
            compTitulo:  request.body.compTitulo,
            compImgPpal:  request.body.compImgPpal,
            compDefinicion:  request.body.compDefinicion,
            compVideo:  request.body.compVideo,
            compDescripcion:  request.body.compDescripcion,
            compImagenes:  request.body.compImagenes,
            compObjetivos:  request.body.compObjetivos,
            compLineasTrabajo:  request.body.compLineasTrabajo,
            recursos: body.recursos
        });
      //save the information in the database
      await newComponent.save();

      //Returns status 200 if the request was created correctly
      return response.status(200).json(newComponent);
  }catch(error){
      // Return status 500 if there is an error sending the request
      return response.status(500).json(error.message);
  }
};

exports.addComponent= addComponent;