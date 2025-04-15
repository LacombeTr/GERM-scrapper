import {Volcano, VolcanoResponse} from "../../types";
import 'dotenv/config';
import {countries, volcanoes} from "../../db/schema";
import {eq} from "drizzle-orm";
import {Request, Response} from "express";
import {dbConnect} from "../../utils/dbConnect";
import slugify from "../../utils/text/slugfier";

export class VolcanoesHandler {

    public static async getAllVolcanoes(request: Request, response: Response) {

        const db = dbConnect();

        try {
            const volcanoesDbResponse = await
                db.select(
                    {
                        name: volcanoes.name,
                        volcanoType: volcanoes.type,
                        country: countries.country,
                        lasteruption: volcanoes.lasteruption,
                        smithsonianid: volcanoes.smithsonianid,
                        altitude: volcanoes.altitude,
                        latitude: volcanoes.latitude,
                        longitude: volcanoes.longitude,
                        slug: volcanoes.slug,
                    })
                    .from(volcanoes)
                    .innerJoin(countries, eq(volcanoes.countryid, countries.id))
                    .execute() as unknown as VolcanoResponse[];

            const allVolcanoes: Volcano[] = []

            volcanoesDbResponse.map((entry) => {
                allVolcanoes.push({
                    name: entry.name,
                    volcanoType: entry.volcanoType,
                    country: entry.country,
                    lastEruption: entry.lasteruption,
                    smithsonianid: entry.smithsonianid,
                    altitude: entry.altitude,
                    coordinates: [Number(entry.latitude), Number(entry.longitude)],
                    slug: slugify(entry.slug),
                })
            })

            response.status(200).json(allVolcanoes);
        } catch (error) {
            console.error("Error fetching volcanoes:", error);
            response.status(500).json({error: "Internal server error"});
        }
    }

    public static async getVolcanoById(request: Request, response: Response) {
        const id = parseInt(request.params.id)

        const db = dbConnect();

        try {
            const volcanoesDbResponse = await db.select({
                name: volcanoes.name,
                volcanoType: volcanoes.type,
                country: countries.country,
                lasteruption: volcanoes.lasteruption,
                smithsonianid: volcanoes.smithsonianid,
                altitude: volcanoes.altitude,
                latitude: volcanoes.latitude,
                longitude: volcanoes.longitude,
                slug: volcanoes.slug
            })
                .from(volcanoes)
                .where(eq(volcanoes.id, id))
                .innerJoin(countries, eq(volcanoes.countryid, countries.id))
                .execute() as unknown as VolcanoResponse[];

            if (volcanoesDbResponse.length > 1) {
                response.status(500).json({error: "The request sent back more than one volcano."});
            }

            if (volcanoesDbResponse[0].name === null) {
                response.status(500).json({error: "The request sent back a nameless volcano"});
            }

            let volcano: Volcano =
                {
                    name: volcanoesDbResponse[0].name ? volcanoesDbResponse[0].name : '',
                    volcanoType: volcanoesDbResponse[0].volcanoType,
                    country: volcanoesDbResponse[0].country,
                    lastEruption: volcanoesDbResponse[0].lasteruption,
                    smithsonianid: volcanoesDbResponse[0].smithsonianid,
                    altitude: volcanoesDbResponse[0].altitude,
                    coordinates: [Number(volcanoesDbResponse[0].latitude), Number(volcanoesDbResponse[0].longitude)],
                    slug: volcanoesDbResponse[0].slug,
                }

            response.status(200).json(volcano);

        } catch (err) {
            console.error("Error fetching volcano by id:", err);
            response.status(500).json({error: "Internal server error"});
        }
    }

    public static async getVolcanoByName(request: Request, response: Response) {
        const name = request.params.name;

        const db = dbConnect();

        try {
            const volcanoesDbResponse = await db.select({
                name: volcanoes.name,
                volcanoType: volcanoes.type,
                country: countries.country,
                lasteruption: volcanoes.lasteruption,
                smithsonianid: volcanoes.smithsonianid,
                altitude: volcanoes.altitude,
                latitude: volcanoes.latitude,
                longitude: volcanoes.longitude,
                slug: volcanoes.slug
            })
                .from(volcanoes)
                .where(eq(volcanoes.slug, slugify(name)))
                .innerJoin(countries, eq(volcanoes.countryid, countries.id))
                .execute() as unknown as VolcanoResponse[];

            if (volcanoesDbResponse.length > 1) {
                response.status(500).json({error: "The request sent back more than one volcano."});
            }

            if (volcanoesDbResponse[0].name === null) {
                response.status(500).json({error: "The request sent back a nameless volcano"});
            }

            let volcano: Volcano =
                {
                    name: volcanoesDbResponse[0].name ? volcanoesDbResponse[0].name : '',
                    volcanoType: volcanoesDbResponse[0].volcanoType,
                    country: volcanoesDbResponse[0].country,
                    lastEruption: volcanoesDbResponse[0].lasteruption,
                    smithsonianid: volcanoesDbResponse[0].smithsonianid,
                    altitude: volcanoesDbResponse[0].altitude,
                    coordinates: [Number(volcanoesDbResponse[0].latitude), Number(volcanoesDbResponse[0].longitude)],
                    slug: volcanoesDbResponse[0].slug,
                }

            response.status(200).json(volcano);

        } catch (err) {
            console.error("Error fetching volcano by name:", err);
            response.status(500).json({error: "Internal server error"});
        }
    }
}