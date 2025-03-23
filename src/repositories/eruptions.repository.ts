import {AppDataSource} from "../config/data-source.config";
import {Eruption} from "../entities/eruptions";
import {Repository} from "typeorm";

export const EruptionRepository: Repository<Eruption> = AppDataSource.getRepository(Eruption);