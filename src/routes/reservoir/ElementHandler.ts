import { Request, Response } from "express";
import { dbConnect } from "../../utils/dbConnect";
import { eq } from "drizzle-orm";
import { ElementValueSelect, PeriodicElement } from "../../types";
import { elementValues } from "../../db/schema";

/**
 * Gestionnaire des routes API pour les éléments géochimiques.
 * Cette classe fournit des méthodes statiques pour récupérer les données
 * d'éléments chimiques depuis la base de données GERM.
 */
export class ElementHandler {
    /**
     * Récupère tous les éléments et leurs valeurs géochimiques de la base de données.
     * 
     * @param request - Objet de requête Express
     * @param response - Objet de réponse Express
     * @returns Tous les enregistrements d'éléments avec leurs valeurs géochimiques
     * 
     * @example
     * GET /elements
     * Retourne: Array<ElementValueSelect>
     */
    public static async getAllElement(request: Request, response: Response) {
        const db = dbConnect();

        try {
            const elementValuesResponse: ElementValueSelect[] = await db
                .select()
                .from(elementValues);

            response.status(200).json(elementValuesResponse);
        } catch (error) {
            response.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * Récupère un élément spécifique par son numéro atomique (z) ou son symbole chimique.
     * 
     * @param request - Objet de requête Express contenant les paramètres de requête
     * @param request.query.z - Numéro atomique de l'élément (optionnel)
     * @param request.query.symbol - Symbole chimique de l'élément (optionnel)
     * @param response - Objet de réponse Express
     * @returns Les valeurs géochimiques de l'élément demandé
     * 
     * @example
     * GET /element?z=6        // Récupère le carbone (C)
     * GET /element?symbol=Fe  // Récupère le fer
     * 
     * @throws {400} Si aucun paramètre z ou symbol n'est fourni
     * @throws {500} En cas d'erreur de base de données
     */
    public static async getElement(request: Request, response: Response) {
        const db = dbConnect();
        const { z, symbol } = request.query;

        try {
            let elementValuesResponse: ElementValueSelect[];

            // Recherche par numéro atomique
            if (z) {
                const elementNumber = parseInt(z as string);
                elementValuesResponse = await db
                    .select()
                    .from(elementValues)
                    .where(eq(elementValues.z, elementNumber))
                    .execute();
            } 
            // Recherche par symbole chimique
            else if (symbol) {
                const elementSymbol = symbol as string;
                elementValuesResponse = await db
                    .select()
                    .from(elementValues)
                    .where(eq(elementValues.element, elementSymbol))
                    .execute();
            } else {
                return response.status(400).json({ error: "Missing z or symbol parameter" });
            }

            response.status(200).json(elementValuesResponse);
        } catch (error) {
            response.status(500).json({ error: "Internal server error" });
        }
    }
}
