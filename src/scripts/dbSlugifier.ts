import {volcanoes} from "../db/schema";
import {dbConnect} from "../utils/dbConnect";
import {eq} from "drizzle-orm";
import slugify from "../utils/text/slugfier";

const dbSlugifier = async () => {
    const db = dbConnect();
    const allVolcanoes = await db.select().from(volcanoes);

    for (const volcano of allVolcanoes) {
        await db.update(volcanoes)
            .set({
                slug: slugify(volcano.name || ''),
            })
            .where(eq(volcanoes.id, volcano.id));
    }
}

dbSlugifier();