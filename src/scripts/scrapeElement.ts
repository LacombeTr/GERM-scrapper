import "dotenv/config";
import { scrapePage } from "../utils/scrapePage";
import { ElementValue, PeriodicElement } from "../types";
import { drizzle } from "drizzle-orm/node-postgres/driver";
import { elementValues } from "../db/schema";

/**
 * Récupère et analyse la page web pour un élément chimique spécifique.
 * @param elementnumber - Le numéro atomique de l'élément à scraper
 * @returns Une promesse qui résout vers un Document DOM de la page récupérée
 */
const fetchedElementPage = async (elementnumber: number) => {
    const fetchedPage = await scrapePage(
        `${process.env.SCRAPING_BASE_URL}/e:${elementnumber}/`
    );

    return fetchedPage;
};

/** Instance de l'ORM Drizzle pour les opérations de base de données */
const db = drizzle(process.env.DATABASE_URL!);

/**
 * Fonction principale qui scrape les données géochimiques pour tous les éléments chimiques.
 * Parcourt les éléments du numéro atomique 1 à 92, extrait les données de chaque page
 * et les sauvegarde dans la base de données.
 *
 * Pour chaque élément:
 * - Récupère la page web correspondante
 * - Parse les tableaux HTML pour extraire les valeurs géochimiques
 * - Sauvegarde les données dans la table element_values
 */
const scrapeElements = async () => {
    // Parcours de tous les éléments du tableau périodique (H à U)
    for (let atomicNumber = 1; atomicNumber <= 92; atomicNumber++) {
        console.log(
            `Scraping element with atomic number: ${PeriodicElement[atomicNumber]}(Z=(${atomicNumber})`
        );
        console.log(`Fetching page...`);
        let fetchedPage: Document | undefined;

        try {
            fetchedPage = await fetchedElementPage(atomicNumber);
            console.log(`Page fetched`);
        } catch (error) {
            console.error("Error fetching the page:", error);
        }

        if (fetchedPage) {
            // Parse chaque ligne du tableau de données géochimiques
            fetchedPage
                .querySelectorAll('tr[valign="top"]')
                .forEach(async (row) => {
                    const cells = row.querySelectorAll("td");
                    /** Liste des noms de sources de données */
                    const sourceList: string[] = [];
                    /** Liste des URLs des sources de données */
                    const sourceURLList: string[] = [];

                    // Extraction des sources et de leurs URLs depuis la cellule 12
                    cells[12]?.querySelectorAll("a")
                        ? cells[12]?.querySelectorAll("a").forEach((source) => {
                              sourceList.push(source.textContent || "");
                          })
                        : null;

                    cells[12]?.querySelectorAll("a")
                        ? cells[12]?.querySelectorAll("a").forEach((source) => {
                              sourceURLList.push(source.href);
                          })
                        : null;

                    /** Objet contenant toutes les données géochimiques extraites pour un élément */
                    const elementData: ElementValue = {
                        reservoir: cells[0]?.textContent?.trim() || "",
                        z: atomicNumber,
                        element: cells[2]?.textContent?.trim() || "",
                        value: cells[3]?.textContent?.trim()
                            ? cells[3].textContent.trim()
                            : null,
                        median: cells[4]?.textContent?.trim()
                            ? cells[4].textContent.trim()
                            : null,
                        sd: cells[5]?.textContent?.trim()
                            ? cells[5].textContent.trim()
                            : null,
                        low: cells[6]?.textContent?.trim()
                            ? cells[6].textContent.trim()
                            : null,
                        high: cells[7]?.textContent?.trim()
                            ? cells[7].textContent.trim()
                            : null,
                        analysisNumber: cells[8]?.textContent?.trim()
                            ? parseFloat(cells[8].textContent?.trim())
                            : null,
                        unit: cells[9]?.textContent?.trim() || null,
                        info: cells[10]?.textContent?.trim() || null,
                        reference: cells[11]?.textContent?.trim() || null,
                        referenceURL:
                            cells[11]?.querySelector("a")?.href || null,
                        source:
                            sourceList.length > 0
                                ? sourceList.join(", ")
                                : null,
                        sourceURL:
                            sourceURLList.length > 0
                                ? sourceURLList.join(", ")
                                : null,
                    };

                    // Insertion en base de données uniquement si l'élément est valide
                    if (elementData.element) {
                        try {
                            await db.insert(elementValues).values(elementData);
                        } catch (error) {
                            console.error(
                                "Database connection error:\n",
                                error
                            );
                            return;
                        }
                    }
                });
            console.log(
                `Values for ${PeriodicElement[atomicNumber]} (Z=${atomicNumber}) scraped and saved successfully.\n ----------------------------------------`
            );
        }
    }
};

// Lancement du processus de scraping
scrapeElements();
