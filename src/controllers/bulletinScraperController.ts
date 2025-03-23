import {NextFunction, Request, Response} from "express";
import {BulletinScraper} from "../services/bulletinScraper";

export class BulletinScraperController {
    static async scrape(url: string, req: Request, res: Response, next: NextFunction): Promise<void> {

        if (url) {
            try {
                const result = await BulletinScraper.scrapeBulletins(url);
                console.log(result);
                res.json(result);
            } catch (error) {
                next(error);
            }
        }
    }
}