// Allos you to work with the database
const mongoose = require("mongoose");
// Mongoose es una librería para Node.js que nos permite escribir consultas para una base de datos de MongooDB
// Un esquema en Mongoose es una estructura JSON que contiene información acerca de las propiedades de un documento. Los esquemas en Mongoose soportan estos tipos de datos: 1.String 2.Number 3.Boolean 4.Buffer (img,pdf) 5.Date 6.Array 7.Schema.Types.ObjectId 8.Schema.Types.Mixed

// Structure of the collection in the database

// Structure of the component form
const componentSchema = mongoose.Schema({
  compTitulo: String,
  //!Color
  compColor: String,
  compImgPpal: String,
  compDefinicion: String,
  compVideo: String,
  compDescripcion: String,
  compImg1: String,
  compImg2: String,
  compImg3: String,
  compObjetivo1: String,
  compObjetivo2: String,
  compObjetivo3: String,
  compLineaTrabajo1: String,
  compLineaTrabajo2: String,
  recursosMetodologia: String,
  recursosFormatos: String,
  recursosDiagnosticos: String,
  recursosHerramientas: String,
  recursosMaterial: String,

  visible: {
    type: Boolean,
    default: true,
  },
});

// REQUIRED: El dato es requerido. TRIM: Básicamente está allí para garantizar que las cadenas que guarde a través del esquema se recorten correctamente. Si agrega { type: String, trim: true }a un campo en su esquema, intentar guardar cadenas como "  hello", o "hello ", o "  hello ", terminará guardándose como "hello"en Mongo, es decir, los espacios en blanco se eliminarán de ambos lados de la cadena.

// The mongoose.model() function of the mongoose module is used to create a collection of a particular database of MongoDB. The name of the collection created by the model function is always in plural format mean GFG to gfss and the created collection imposed a definite structure. Syntax: mongoose.model(<Collectionname>, <CollectionSchema>) Parameters: This function accepts the following two parameters:Collection name: It is the name of the collection.Collection Schema: It is the schema of the collection.

const Componente = mongoose.model("Componente", componentSchema);

module.exports = Componente;

// Cuando tiene un módulo que exporta solo UNA cosa, es más común usar module.exports. El formato CommonJS (CJS) se usa en Node.js y utiliza requirey module.exports para definir dependencias y módulos. El ecosistema npm se basa en este formato.
