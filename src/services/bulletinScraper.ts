import {BulletinParsers} from "../utils/bulletinParsers";
import {Bulletin} from "../types";
import {scrapePage} from "../utils/scrapePage";
import {createProgressBar} from "../utils/logs/progressBar";

export class BulletinScraper {

    /**
     * Scrapes data from weekly bulletins in the form of an XML file, processes it and returns a Bulletins table.
     * @param url
     */
    static async scrapeBulletins(url: string,): Promise<Bulletin[]> {
        console.log('[1/2] Scrapping Bulletins!\n')

        // Bulletin array initialization
        const bulletinList: Bulletin[] = [];

        // Parsing of XML to an easy to handle Cheerios object
        const page = await scrapePage(url)

        // Iterating on the various <item> in the parsed DOM
        page("item").map((index, element) => {

            // Extraction of the Bulletin attributes
            const {volcanoName, country, dates, status} = BulletinParsers.parseTitle(page(element).find("title").text())
            const {description, source} = BulletinParsers.parseDesc(page(element).find("description").text())
            const pubDate = BulletinParsers.parsePubDate(page(element).find("pubDate").text())
            const coordinates = BulletinParsers.parsePosition(page(element).find("georss\\:point").text());

            // Bulletin object creation
            const bulletin: Bulletin = {
                volcano: volcanoName,
                country: country,
                status: status,
                watchStart: dates[0],
                watchEnd: dates[1],
                description: description,
                source: source,
                pubDate: pubDate,
                coordinates: coordinates,
            };

            // Ajout du bulletin au tableau
            bulletinList.push(bulletin);

            const advancement = (index + 1) / page("item").length * 100;
            createProgressBar(advancement);
        })

        console.log('Bulletins scrapping finished!')

        return bulletinList;
    }
}