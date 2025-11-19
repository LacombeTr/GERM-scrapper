import axios from "axios";
import { JSDOM } from "jsdom";

export async function scrapePage(url: string) {
    const { data } = await axios.get(url, {
        responseEncoding: "latin1",
        decompress: true, // Assure que les données compressées sont bien gérées
    });

    const dom = new JSDOM(data);

    return dom.window.document;
}
