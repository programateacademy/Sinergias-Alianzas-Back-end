//import express
const express = require("express");
const router = express.Router();

// Router: Es utilizado para  añadir más páginas a nuestro sitio,es la manera de crear las rutas básicas para sitios web, y también la forma en la que finalmente construiremos  nuestras APIs RESTful que utilizará una app frontend

//Get functionality from controller

// Linea 9 se crea una contante que llama a la función creada en el controlador y se requiere dicho documento donde reposa.
const{ addComponent, getComponents, updateComponent, deleteComponent, getComponent } = require("../controllers/componentController");


//Routes to the API
// Se establecen las rutas a utilizar en la API usando los metodos de .get (Para OBTENER RECURSOS del servidor).post (Para CREAR un recurso del servidos) .put (para ACTUALIZAR un recurso del servidor) .delete (Para ELIMINAR un recurso del servidos)
router.post("/new", addComponent); //Create Component
router.get("/", getComponents); //List Component
router.get('/seeComponent/:id', getComponent)// get component info
router.put("/updateComponent/:id", updateComponent); //Update Component

//!Working delete
router.put("/delete/:id", deleteComponent); //Delete Component


module.exports = router;