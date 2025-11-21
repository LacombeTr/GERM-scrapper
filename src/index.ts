import express, { Request, Response } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { ElementHandler } from "./routes/reservoir/ElementHandler";
import { setupSwagger } from "./config/swaggerConfig";

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
 * @swagger
 * /reservoir/:
 *   get:
 *     summary: Get all values
 *     description: Retrieve geochemical values for all elements in the database
 *     tags: [Elements]
 *     responses:
 *       200:
 *         description: Element values found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElementValue'
 *       404:
 *         description: Element not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/reservoir", ElementHandler.getAllElement);

/**
 * @swagger
 * /reservoir/z/{z}:
 *   get:
 *     summary: Get element by atomic number
 *     description: Retrieve geochemical values for an element using its atomic number (1-92)
 *     tags: [Elements]
 *     parameters:
 *       - in: path
 *         name: z
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 92
 *         description: Atomic number of the element
 *         example: 6
 *     responses:
 *       200:
 *         description: Element values found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElementValue'
 *       404:
 *         description: Element not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/reservoir/z/:z", (req: Request, res: Response) => {
    req.query.z = req.params.z;
    ElementHandler.getElement(req, res);
});

/**
 * @swagger
 * /reservoir/symbol/{symbol}:
 *   get:
 *     summary: Get element by element symbol
 *     description: Retrieve geochemical values for an element using its atomic number (1-92)
 *     tags: [Elements]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Element symbol
 *         example: C
 *     responses:
 *       200:
 *         description: Element values found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElementValue'
 *       404:
 *         description: Element not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/reservoir/symbol/:symbol", (req: Request, res: Response) => {
    req.query.symbol = req.params.symbol;
    ElementHandler.getElement(req, res);
});

setupSwagger(app);

/**
 * Démarre le serveur Express sur le port configuré
 */
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur ${PORT}`);
});
