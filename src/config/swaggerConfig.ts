import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VolcAPI Documentation",
            version: "1.0.0",
            description: "Documentation de l'API VolcAPI",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Serveur de développement",
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // 🔍 Scanner les fichiers de routes
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {};
