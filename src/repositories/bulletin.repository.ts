import {AppDataSource} from "../config/data-source.config";
import {Bulletin} from "../entities/bulletins";
import {Repository} from "typeorm";

export const BulletinRepository: Repository<Bulletin> = AppDataSource.getRepository(Bulletin);