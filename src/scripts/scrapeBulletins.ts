import {BulletinScraper} from "../services/bulletinScraper";
import 'dotenv/config';
import {Bulletin, BulletinQuery, VolcanoQuery} from "../types";
import {drizzle} from "drizzle-orm/node-postgres";
import {bulletins, countries, volcanoes} from "../db/schema";
import {sql} from "drizzle-orm";
import {createProgressBar} from "../utils/logs/progressBar";

async function scrapeBulletins(scrapingURL: string) {
    console.time("scriptExecutionTime");
    console.log("Scraping volcanoes infos ! \n")

    const db = drizzle(process.env.DATABASE_URL!);

    let bulletinsList: Bulletin[] | undefined;

    try {
        bulletinsList = await BulletinScraper.scrapeBulletins(scrapingURL) as unknown as Bulletin[];

        console.log("\n[2/2]  Database seeding.\n")
        for (let i = 0; i < bulletinsList.length; i++) {

            const entry = bulletinsList[i];


            console.log(entry)
            console.log('\n')


            const volcanoID =
                await db.select({id: volcanoes.id})
                    .from(volcanoes)
                    .where(sql`unaccent(lower(${volcanoes.name})) = unaccent(lower(${entry.volcano}))`);

            if (!volcanoID) {
                console.error(`No ID found for volcano ${entry.volcano}`);
            }

            const countryID =
                await db.select({id: countries.id})
                    .from(countries)
                    .where(sql`unaccent(lower(${countries.country})) = unaccent(lower(${entry.country}))`);

            if (!countryID) {
                console.error(`No ID found for country ${entry.country}`);
            }

            const bulletin: BulletinQuery = {
                volcanoid: volcanoID[0].id,
                countryid: countryID[0].id,
                status: entry.status,
                watchstart: entry.watchStart.toISOString().split("T")[0],
                watchend: entry.watchEnd.toISOString().split("T")[0],
                description: entry.description,
                source: entry.source,
                pubdate: entry.pubDate.toISOString().split("T")[0],
                latitude: entry.coordinates[0]?.toString(),
                longitude: entry.coordinates[1]?.toString(),
            }

            await db.insert(bulletins).values(bulletin);

            const advancement = ((i + 1) / bulletinsList.length) * 100
            createProgressBar(advancement)
        }

        console.log("Database seeding finished")

    } catch (error) {
        console.error(error)
    }

    console.log("\nFINISHED! \nTotal script duration:")
    console.timeEnd("scriptExecutionTime");
}

if (process.env.BULLETIN_URL) {
    scrapeBulletins(process.env.BULLETIN_URL);
} else {
    console.error("No scraping URL defined")
}