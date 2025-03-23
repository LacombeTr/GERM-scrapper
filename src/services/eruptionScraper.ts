import 'dotenv/config';
import {scrapePage} from "../utils/scrapePage";
import {EruptionParser} from "../utils/eruptionParser";
import {DateParsers} from "../utils/date";
import Cheerio = cheerio.Cheerio;
import {createProgressBar} from "../utils/logs/progressBar";

export class EruptionScraper {

    public static async scrapeEruptions(volcanoIDList: { volcanoSmithsonianID: number | null, volcanoID: number }[]) {

        console.log("\n[2/3] Scraping eruptions infos ! \n")

        const eruptions = []

        const baseURL = process.env.VOLCANO_PAGE_BASE_URL;

        for (let index = 0; index < volcanoIDList.length; index++) {

            const volcano = volcanoIDList[index]

            const id = volcano.volcanoSmithsonianID;
            console.log(`\n${id}\n\n`)

            if (id && baseURL) {
                const volcanoURL = baseURL + id
                const volcanoid = volcano.volcanoID;

                const page = await scrapePage(volcanoURL)

                const eruptionElementList: Array<[Cheerio, Cheerio]> = []

                page('.eruption-accordion > p').each((index, p) => {
                    const nextDiv = page(p).next('div');
                    if (nextDiv.length) {
                        eruptionElementList.push([
                            page(p),
                            nextDiv
                        ]);
                    }
                });

                if (eruptionElementList && eruptionElementList.length !== 0) {

                    // For each eruption tab
                    for (let index = 0; index < eruptionElementList.length; index++) {

                        const eruptionElement = eruptionElementList[index][0];
                        const eruptionDetailsElement = eruptionElementList[index][1];

                        // Extract the eruptions date
                        const eruptionDate = page(eruptionElement).contents()
                            .filter((_, node) => node.type === "text")
                            .text().trim()

                        const [startDate, uncertaintyStartDate, endDate, uncertaintyEndDate] =
                            DateParsers.eruptionDateParser(eruptionDate);

                        const eruptionInfos = page(eruptionElement).find('span')
                        const eruptionDetails = page(eruptionDetailsElement)

                        const {confirmed, type, vei} = EruptionParser.eruptionInfosParser(eruptionInfos, page)

                        const episodesList = EruptionParser.episodeInfoParser(eruptionDetails, page)

                        const eruption = {
                            volcanoid: volcanoid,
                            startdate: startDate,
                            enddate: endDate,
                            uncertaintystartdate: uncertaintyStartDate,
                            uncertaintyenddate: uncertaintyEndDate,
                            confirmed: confirmed,
                            type: type,
                            vei: vei,
                            episodes: episodesList,
                        }

                        eruptions.push(eruption)
                    }
                }
            }
            console.log("\n")
            const advancement = ((index + 1) / volcanoIDList.length) * 100
            createProgressBar(advancement)

        }

        return eruptions;

        console.log("\nEruptions infos scraping finished ! \n")
    }
}