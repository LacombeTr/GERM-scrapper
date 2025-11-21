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
                "Documentation for the unofficial GERM (Geochemical Earth Reference Model) API by Tristan Lacombe.",
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
    },
    apis: ["./src/routes/*.ts"], // 🔍 Scanner les fichiers de routes
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
    // Option 1 : Swagger disponible uniquement en développement
    if (process.env.NODE_ENV !== "production") {
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        console.log("📚 Swagger disponible sur /api-docs");
    }

    // Option 2 : Swagger disponible partout (décommenter si nécessaire)
    // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
