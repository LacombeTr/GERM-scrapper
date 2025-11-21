import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GERM api Documentation",
            version: "1.0.0",
            description:
                "Documentation for the unofficial GERM (Geochemical Earth Reference Model) API by Tristan Lacombe. \n Contact me at tlacombevulca@outlook.fr",
        },
        servers: [
            {
                url:
                    process.env.NODE_ENV === "production"
                        ? process.env.API_URL || "https://germ-api.lacombet.fr"
                        : "http://localhost:3000",
                description:
                    process.env.NODE_ENV === "production"
                        ? "Serveur de production"
                        : "Serveur de développement",
            },
        ],
        components: {
            schemas: {
                ElementValue: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "Unique identifier",
                            example: 1,
                        },
                        reservoir: {
                            type: "string",
                            description: "Name of the geological reservoir",
                            example: "Primitive Mantle",
                        },
                        z: {
                            type: "integer",
                            description: "Atomic number",
                            example: 14,
                        },
                        element: {
                            type: "string",
                            description: "Element symbol or name",
                            example: "Si",
                        },
                        value: {
                            type: "number",
                            description: "Main concentration value",
                            example: 23.5,
                        },
                        median: {
                            type: "number",
                            description: "Median value",
                            example: 22.8,
                        },
                        sd: {
                            type: "number",
                            description: "Standard deviation",
                            example: 1.2,
                        },
                        low: {
                            type: "number",
                            description: "Minimum value",
                            example: 20.5,
                        },
                        high: {
                            type: "number",
                            description: "Maximum value",
                            example: 25.3,
                        },
                        analysisNumber: {
                            type: "integer",
                            description: "Number of analyses",
                            example: 150,
                        },
                        unit: {
                            type: "string",
                            description: "Unit of measurement",
                            example: "wt%",
                        },
                        info: {
                            type: "string",
                            description: "Additional information",
                        },
                        reference: {
                            type: "string",
                            description: "Reference citation",
                        },
                        referenceURL: {
                            type: "string",
                            description: "Link to the reference",
                        },
                        source: {
                            type: "string",
                            description: "Source name",
                        },
                        sourceURL: {
                            type: "string",
                            description: "Link to the source",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "Error message",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/index.ts", "./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
    // Option 1 : Swagger disponible uniquement en développement
    if (process.env.NODE_ENV === "production") {
        app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
};
