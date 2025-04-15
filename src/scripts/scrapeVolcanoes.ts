import {VolcanoScraper} from "../services/volcanoScraper";
import 'dotenv/config';
import {Volcano, VolcanoQuery} from "../types";
import {drizzle} from "drizzle-orm/node-postgres";
import {countryIDs} from "../utils/countries";
import {volcanoes} from "../db/schema";
import {createProgressBar} from "../utils/logs/progressBar";
import {convertToUtf8} from "../utils/text/convertToUTF8";
import slugify from "../utils/text/slugfier";


async function scrapeVolcanoes(entryNumber?: number, offset?: number) {
    console.time("scriptExecutionTime");
    console.log("Scraping volcanoes infos ! \n")
    const db = drizzle(process.env.DATABASE_URL!);

    let volcanoURLList: string[];
    let volcanoList: Volcano[];

    try {
        volcanoURLList = await VolcanoScraper.getVolcanoesList(entryNumber, offset);

        volcanoList = await VolcanoScraper.scrapeVolcanoes(volcanoURLList)

        console.log("\n[3/3]  Database seeding.")

        for (let i = 0; i < volcanoList.length; i++) {

            const entry = volcanoList[i]

            const volcano: VolcanoQuery = {
                name: convertToUtf8(entry.name),
                type: entry.volcanoType,
                countryid: entry.country !== null ? countryIDs[entry.country] : null,
                altitude: entry.altitude,
                latitude: entry.coordinates[0] ? entry.coordinates[0].toString() : null,
                longitude: entry.coordinates[1] ? entry.coordinates[1].toString() : null,
                lasteruption: entry.lastEruption ? entry.lastEruption : null,
                smithsonianid: entry.smithsonianid ? entry.smithsonianid : null,
                slug: entry.slug,
            }

            await db.insert(volcanoes).values(volcano);

            const advancement = ((i + 1) / volcanoList.length) * 100
            createProgressBar(advancement)
        }

        console.log("\nDatabase seeding finished")

    } catch (error) {
        console.error(error);
    }

    console.log("\nFINISHED! \nTotal script duration:")
    console.timeEnd("scriptExecutionTime");
}

scrapeVolcanoes()