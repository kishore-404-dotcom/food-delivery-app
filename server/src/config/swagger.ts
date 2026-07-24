import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "./env";


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
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
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
