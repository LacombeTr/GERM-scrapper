import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapePage(url: string){

    // Gathering of the bulletins RSS flux (XML format)
    const {data} = await axios.get(url, {
        responseEncoding: "latin1",
        decompress: true, // Assure que les données compressées sont bien gérées
    });

    // Parsing of XML to an easy to handle Cheerios object
    const $ = cheerio.load(data);

    return $
}