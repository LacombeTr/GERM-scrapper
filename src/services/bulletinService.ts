import { AppDataSource } from "../config/data-source.config";
import { Bulletin } from "../entities/bulletins";

const bulletinRepository = AppDataSource.getRepository(Bulletin);

export const getAllBulletins = async () => {
    return await bulletinRepository.find();
};

export const createBulletin = async (age: number) => {
    const newBulletin: Bulletin = bulletinRepository.create({  });
    return await bulletinRepository.save(newBulletin);
};

export const deleteBulletin = async (id: number) => {
    return await bulletinRepository.delete(id);
};
