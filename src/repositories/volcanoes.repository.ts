import {AppDataSource} from "../config/data-source.config";
import {Volcano} from "../entities/volcanoes";
import {Repository} from "typeorm";

export const VolcanoRepository: Repository<Volcano> = AppDataSource.getRepository(Volcano);