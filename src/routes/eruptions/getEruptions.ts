import {Request, Response} from "express";
import {dbConnect} from "../../utils/dbConnect";
import {episodes, eruptions, events, volcanoes} from "../../db/schema";
import {eq} from "drizzle-orm";
import slugify from "../../utils/text/slugfier";
import {EruptionDBResponse} from "../../types";
import groupEvents from "../../utils/groupEvents";

export class GetEruptions {

    public static async getAllEruptions(request: Request, response: Response) {

        const db = dbConnect()

        try {
            const eruptionsDBresponse: Array<EruptionDBResponse> = await
                db.select(
                    {
                        // Eruption_______
                        eruptionId: eruptions.id,
                        volcano: volcanoes.name,
                        startDate: eruptions.startdate,
                        endDate: eruptions.enddate,
                        uncertaintyStartDate: eruptions.uncertaintystartdate,
                        uncertaintyEndDate: eruptions.uncertaintyenddate,
                        confirmed: eruptions.confirmed,
                        type: eruptions.type,
                        vei: eruptions.vei,
                        // Episode________
                        episodeId: episodes.id,
                        episodeStartDate: episodes.startdate,
                        episodeEndDate: episodes.enddate,
                        location: episodes.location,
                        sourceConf: episodes.sourceofconf,
                        typeEpisode: episodes.typeofepisode,
                        // Event__________
                        eventStartDate: events.startdate,
                        eventEndDate: events.enddate,
                        eventType: events.eventtype,
                        remarks: events.remarks,
                    }
                )
                    .from(eruptions)
                    .innerJoin(volcanoes, eq(eruptions.volcanoid, volcanoes.id))
                    .leftJoin(episodes, eq(eruptions.id, episodes.eruptionid))
                    .leftJoin(events, eq(episodes.id, events.episodeid));

            const finalEruptions = groupEvents(eruptionsDBresponse);

            response.status(200).json(finalEruptions);

        } catch (error) {
            // console.error("Error fetching eruptions:", error);
            response.status(500).json({error: "Internal server error"});
        }
    }

    public static async getEruptionsByVolcanoID(request: Request, response: Response) {

        const db = dbConnect()
        const id = parseInt(request.params.id)

        try {
            const eruptionsDBresponse: Array<EruptionDBResponse> = await
                db.select(
                    {
                        // Eruption_______
                        eruptionId: eruptions.id,
                        volcano: volcanoes.name,
                        startDate: eruptions.startdate,
                        endDate: eruptions.enddate,
                        uncertaintyStartDate: eruptions.uncertaintystartdate,
                        uncertaintyEndDate: eruptions.uncertaintyenddate,
                        confirmed: eruptions.confirmed,
                        type: eruptions.type,
                        vei: eruptions.vei,
                        // Episode________
                        episodeId: episodes.id,
                        episodeStartDate: episodes.startdate,
                        episodeEndDate: episodes.enddate,
                        location: episodes.location,
                        sourceConf: episodes.sourceofconf,
                        typeEpisode: episodes.typeofepisode,
                        // Event__________
                        eventStartDate: events.startdate,
                        eventEndDate: events.enddate,
                        eventType: events.eventtype,
                        remarks: events.remarks,
                    }
                )
                    .from(eruptions)
                    .where(eq(eruptions.volcanoid, id))
                    .innerJoin(volcanoes, eq(eruptions.volcanoid, volcanoes.id))
                    .leftJoin(episodes, eq(eruptions.id, episodes.eruptionid))
                    .leftJoin(events, eq(episodes.id, events.episodeid))
                    .execute();

            const finalEruptions = groupEvents(eruptionsDBresponse);

            response.status(200).json(finalEruptions);

        } catch (error) {
            console.error("Error fetching volcanoes:", error);
            response.status(500).json({error: "Internal server error"});
        }
    }

    public static async getEruptionsByVolcanoName(request: Request, response: Response) {

        const db = dbConnect()
        const name = request.params.name

        try {
            const eruptionsDBresponse: Array<EruptionDBResponse> = await
                db.select(
                    {
                        // Eruption_______
                        eruptionId: eruptions.id,
                        volcano: volcanoes.name,
                        startDate: eruptions.startdate,
                        endDate: eruptions.enddate,
                        uncertaintyStartDate: eruptions.uncertaintystartdate,
                        uncertaintyEndDate: eruptions.uncertaintyenddate,
                        confirmed: eruptions.confirmed,
                        type: eruptions.type,
                        vei: eruptions.vei,
                        // Episode________
                        episodeId: episodes.id,
                        episodeStartDate: episodes.startdate,
                        episodeEndDate: episodes.enddate,
                        location: episodes.location,
                        sourceConf: episodes.sourceofconf,
                        typeEpisode: episodes.typeofepisode,
                        // Event__________
                        eventStartDate: events.startdate,
                        eventEndDate: events.enddate,
                        eventType: events.eventtype,
                        remarks: events.remarks,
                    }
                )
                    .from(eruptions)
                    .innerJoin(volcanoes, eq(eruptions.volcanoid, volcanoes.id))
                    .leftJoin(episodes, eq(eruptions.id, episodes.eruptionid))
                    .leftJoin(events, eq(episodes.id, events.episodeid))
                    .where(eq(volcanoes.slug, slugify(name)))
                    .execute();


            const finalEruptions = groupEvents(eruptionsDBresponse);

            response.status(200).json(finalEruptions);

        } catch (error) {
            console.error("Error fetching volcanoes:", error);
            response.status(500).json({error: "Internal server error"});
        }
    }
}

