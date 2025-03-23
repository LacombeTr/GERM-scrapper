import {Volcano} from "../types";
import 'dotenv/config';
import {scrapePage} from "../utils/scrapePage";
import {VolcanoParser} from "../utils/volcanoParser";
import {createProgressBar} from "../utils/logs/progressBar";

export class VolcanoScraper {

    /**
     * Scrape the infos of volcanoes based on a list of URL
     * @param {string} volcanoURLList - A list of volcano page URL
     */
    public static async scrapeVolcanoes(volcanoURLList: string[]) {
        const volcanoesInfoList: Volcano[] = [];

        console.log("\n[2/3]  Scrappping volcanoes infos\n");

        // Gather the information for each volcano
        for (let j = 0; j < volcanoURLList.length; j++) {

            const volcanoURL = volcanoURLList[j]

            const volcanoPage = `https://volcano.si.edu/${volcanoURL}`;

            const page = await scrapePage(volcanoPage)

            const volcanoName = page(".volcano-title-container > h3").text();

            const {
                country,
                volcanoType,
                lastEruption
            } = VolcanoParser.parseVolcanoInfos(page(".volcano-info-table > ul > .shaded"), page)

            const {
                altitude,
                coordinates,
                smithsonianid
            } = VolcanoParser.parseVolcanoGeo(page(".volcano-subinfo-table > ul > .clear"), page)

            const volcanoInfos: Volcano = {
                name: volcanoName,
                volcanoType: volcanoType,
                country: country,
                coordinates: coordinates,
                altitude: altitude,
                lastEruption: lastEruption,
                smithsonianid: smithsonianid
            }
            volcanoesInfoList.push(volcanoInfos);

            const advancement = ((j + 1) / volcanoURLList.length) * 100
            createProgressBar(advancement)
        }

        console.log("Scrappping finished.")

        return volcanoesInfoList
    }

    /**
     * Get the list of holocenes volcanoes (~ actives volcanoes)
     * @param {number} [volcanoNumber] - Desired number of entries, if not given the method return the whole list
     * @param offset
     */
    public static async getVolcanoesList(volcanoNumber?: number, offset?: number): Promise<string[]> {
        const volcanoListUrl = process.env.VOLCANO_LIST_URL;

        if(!offset){
            offset = 0;
        }

        if (volcanoListUrl) {

            console.log("[1/3] Fetching volcanoes list!")

            const page = await scrapePage(volcanoListUrl)

            let volcanoesPagesList: string[] = []

            // Gather the URL for each element if a length is specified
            if (volcanoNumber) {
                page(".TableSearchResults a").slice(offset, offset + volcanoNumber).map(
                    (i, el) => {
                        volcanoesPagesList.push(
                            page(el).attr('href')?.toString() ?
                                String(page(el).attr('href')?.toString()) : 'Error with link'
                        )
                    }
                );

                // Gather the URL for each element if no length is specified
            } else {
                page(".TableSearchResults a").map(
                    (i, el) =>
                        volcanoesPagesList.push(
                            page(el).attr('href')?.toString() ?
                                String(page(el).attr('href')?.toString()) : 'Error with link'
                        )
                );
            }

            console.log("Volcanoes list acquired !")

            return volcanoesPagesList;


        } else {
            console.error("Unable to reach volcanoes list page, check URL")
            return ['0']
        }
    }
}