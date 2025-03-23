import "reflect-metadata";
import {DataSource} from "typeorm";

import {Continent} from "../entities/continents"
import {Country} from "../entities/countries"
import {Bulletin} from "../entities/bulletins";
import {Eruption} from "../entities/eruptions";
import {EruptionType} from "../entities/eruptionsType";
import {Volcano} from "../entities/volcanoes";
import {VolcanoType} from "../entities/volcanoTypes";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Continent, Country, Bulletin, Eruption, EruptionType, Volcano, VolcanoType],
});