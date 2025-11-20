import axios from "axios";
import { JSDOM } from "jsdom";

/**
 *  Récupère une page web et renvoie le HTML sous la forme d'un objet DOM manipulable
 * @param url {string} - url pour recurper la page à scraper
 * @returns 
 */
export async function scrapePage(url: string) {
    const { data } = await axios.get(url, {
        responseEncoding: "latin1",
        decompress: true, // Assure que les données compressées sont bien gérées
    });

    const dom = new JSDOM(data);

    return dom.window.document;
}
