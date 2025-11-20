import express, { Request, Response } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { ElementHandler } from "./routes/reservoir/ElementHandler";

/**
 * Serveur Express principal pour l'API GERM (Geochemical Earth Reference Model).
 * Ce serveur fournit des endpoints RESTful pour accéder aux données géochimiques
 * d'éléments chimiques provenant de différents réservoirs géologiques.
 */

/** Instance de l'application Express */
const app = express();

/** Port d'écoute du serveur (défini par la variable d'environnement PORT ou 3000 par défaut) */
const PORT = process.env.PORT || 3000;

/** Instance de connexion à la base de données PostgreSQL via Drizzle ORM */
const db = drizzle(process.env.DATABASE_URL!);

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

/**
 * Route racine - Message de bienvenue de l'API
 * @route GET /
 * @returns {string} Message de bienvenue
 */
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the VolcAPI");
});

/**
 * Route pour récupérer tous les éléments géochimiques
 * @route GET /reservoir
 * @returns {ElementValueSelect[]} Liste complète des valeurs d'éléments géochimiques
 */
app.get("/reservoir", ElementHandler.getAllElement);

/**
 * Route pour récupérer un élément par son numéro atomique
 * @route GET /reservoir/z/:z
 * @param {number} z - Numéro atomique de l'élément (1-92)
 * @returns {ElementValueSelect[]} Valeurs géochimiques pour l'élément spécifié
 * @example GET /reservoir/z/6 // Récupère les données du carbone
 */
app.get("/reservoir/z/:z", (req: Request, res: Response) => {
    req.query.z = req.params.z;
    ElementHandler.getElement(req, res);
});

/**
 * Route pour récupérer un élément par son symbole chimique
 * @route GET /reservoir/symbol/:symbol
 * @param {string} symbol - Symbole chimique de l'élément (ex: "Fe", "Si", "Al")
 * @returns {ElementValueSelect[]} Valeurs géochimiques pour l'élément spécifié
 * @example GET /reservoir/symbol/Fe // Récupère les données du fer
 */
app.get("/reservoir/symbol/:symbol", (req: Request, res: Response) => {
    req.query.symbol = req.params.symbol;
    ElementHandler.getElement(req, res);
});

/**
 * Démarre le serveur Express sur le port configuré
 */
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur ${PORT}`);
});
