import Cheerio = cheerio.Cheerio;
import Root = cheerio.Root;
import {Coordinates} from "../types";

export class VolcanoParser {

    /**
     * Extract the infos of the volcano information panel (country, volcano type and last eruption year)
     * @param infos - the list node with the information
     * @param dom - the root element
     */
    public static parseVolcanoInfos(infos: Cheerio, dom: Root) {
        let lastEruptionDate: number | null = null;
        let volcanoType: string = '';
        let countryName: string | null = null;

        const [rawCountry, , rawVolcanoType, rawLastEruption] = infos.map((i, el) => dom(el).text().trim()).toArray();

        if (rawCountry) {
            countryName = rawCountry.toString().split('-')[0].trim()
        }

        const volcanoTypeRegEx = /\|\s*([^|]+)/
        const foundVolcanoType = rawVolcanoType.toString().match(volcanoTypeRegEx);

        if (foundVolcanoType) {
            volcanoType = foundVolcanoType[1].trim().toString();
        }

        const eraRegEx = /[A-Z]+/
        const dateRegEx = /\d+/
        const foundLastEruptionEra = rawLastEruption.toString().match(eraRegEx);
        const foundLastEruptionDate = rawLastEruption.toString().match(dateRegEx);

        if (foundLastEruptionEra && foundLastEruptionDate) {
            if (foundLastEruptionEra[0].toString() === "BCE") {
                lastEruptionDate = -Number(foundLastEruptionDate[0].toString());
            } else if (foundLastEruptionEra[0].toString() === "CE") {
                lastEruptionDate = Number(foundLastEruptionDate[0].toString());
            }
        }

        return {
            country: countryName,
            volcanoType: volcanoType,
            lastEruption: lastEruptionDate
        }
    }

    /**
     * Extract the geographical infos of the volcano information panel (latitude, longitude, altitude)
     * @param infos - the list node with the information
     * @param dom - the root element
     */
    public static parseVolcanoGeo(infos: Cheerio, dom: Root) {
        let latitude: number | null = null;
        let longitude: number | null = null;
        let altitude: number = 0;

        const [rawLatitude, rawLongitude, , rawElevation, , smithsonianVolcanoID] = infos.map((i, el) => dom(el).text().trim()).toArray();

        const coordinatesRegEx = /[-+]?\d*\.?\d+/;
        const foundLatitude = rawLatitude.toString().match(coordinatesRegEx);
        const foundLongitude = rawLongitude.toString().match(coordinatesRegEx);

        const orientationRegEx = /\w$/
        const foundLatitudeOrientation = rawLatitude.toString().match(orientationRegEx);
        const foundLongitudeOrientation = rawLongitude.toString().match(orientationRegEx);

        const foundAltitude = rawElevation.toString().match(/(.*?)\sm/);

        if (foundLatitudeOrientation && foundLongitudeOrientation && foundLatitude && foundLongitude) {
            if (foundLatitudeOrientation[0].toString() === "S") {
                latitude = -Number(foundLatitude[0].toString());
            } else {
                latitude = Number(foundLatitude[0].toString());
            }

            if (foundLongitudeOrientation[0].toString() === "W") {
                longitude = -Number(foundLongitude[0].toString());
            } else {
                longitude = Number(foundLongitude[0].toString());
            }
        }

        if (foundAltitude) {
            altitude = Number(foundAltitude[1].toString().replace('\,', ''));
        }

        return {
            altitude: altitude,
            coordinates: [latitude, longitude] as Coordinates,
            smithsonianid: Number(smithsonianVolcanoID),
        }
    }
}