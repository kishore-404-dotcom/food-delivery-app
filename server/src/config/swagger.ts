import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const options = {

  definition: {

    openapi: "3.0.0",

    info: {

      title: "Food Delivery API",

      version: "1.0.0",

      description:
        "Production Ready Food Delivery Backend",

    },

    servers: [

      {
        url: "http://localhost:5000",
      },

    ],

  },

  apis: [],
};


const swaggerSpec =
  swaggerJSDoc(options);


export {
  swaggerUi,
  swaggerSpec,
};