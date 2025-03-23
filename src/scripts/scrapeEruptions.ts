import 'dotenv/config';
import {EpisodeQuery, Eruption, EruptionQuery, EruptiveEventQuery, Volcano, VolcanoQuery} from "../types";
import {drizzle} from "drizzle-orm/node-postgres";
import {episodes, eruptions, events, volcanoes} from "../db/schema";
import {EruptionScraper} from "../services/eruptionScraper";
import {createProgressBar} from "../utils/logs/progressBar";

async function scrapeEruptions() {
    console.time("scriptExecutionTime");

    const db = drizzle(process.env.DATABASE_URL!);

    let eruptionList: Eruption[];

    try {
        console.log("\n[1/3] Getting database volcanoes list.\n")

        // Get the list of volcanoes smithsonianID from the database
        let volcanoIDList = await db.select({volcanoID: volcanoes.id,volcanoSmithsonianID: volcanoes.smithsonianid})
            .from(volcanoes)

        const eruptionList = await EruptionScraper.scrapeEruptions(volcanoIDList);
        console.log("\nDatabase volcanoes list acquired !.\n")

        console.log("\n[2/3] Database seeding.\n")

        for(let index = 0; index < eruptionList.length; index++) {

            const eruption = eruptionList[index]

            const eruptionQuery: EruptionQuery = {
                volcanoid: eruption.volcanoid,
                startdate: eruption.startdate,
                enddate: eruption.enddate,
                uncertaintystartdate: eruption.uncertaintystartdate,
                uncertaintyenddate: eruption.uncertaintyenddate,
                confirmed: eruption.confirmed,
                type: eruption.type,
                vei: eruption.vei
            }

            const [insertedEruption] = await db.insert(eruptions).values(eruptionQuery).returning({id: eruptions.id});

            const eruptionid = insertedEruption.id

            if (eruption.episodes) {

                for(let episode of eruption.episodes) {

                    const episodeQuery: EpisodeQuery = {
                        eruptionid: eruptionid,
                        startdate: episode.startdate,
                        enddate: episode.enddate,
                        location: episode.location,
                        sourceofconf: episode.sourceofconf,
                        typeofepisode: episode.typeoferuption,
                    }

                    const [insertedEpisode] = await db.insert(episodes).values(episodeQuery).returning({id: episodes.id});

                    const episodeid = insertedEpisode.id;

                    if (episode.events) {

                        for(let event of episode.events) {
                            const eventQuery: EruptiveEventQuery = {
                                episodeid: episodeid,
                                startdate: event.startdate,
                                enddate: event.enddate,
                                eventtype: event.eventtype,
                                remarks: event.remarks,
                            }

                            const [insertedEvent] = await db.insert(events).values(eventQuery).returning({id: events.id});
                        }
                    }
                }
            }

            const advancement = ((index + 1) / eruptionList.length) * 100
            createProgressBar(advancement)
        }

    } catch (error: any) {
        throw new Error(error.message);
    }

    console.log("\nFINISHED! \nTotal script duration:")
    console.timeEnd("scriptExecutionTime");
}

scrapeEruptions()