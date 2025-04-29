import {boolean, integer, text, varchar} from "drizzle-orm/pg-core/index";
import {episodes, eruptions, events, volcanoes} from "./db/schema";

/**
 * Type for gps coordinates
 * @property {[number, number]} coordinates -  [latitude, longitude]
 */
export type Coordinates = [number, number] | [null, null]

/**
 * Type for a bulletin
 * @property {string} volcano - volcano name
 * @property {string} country - country where the volcano is located
 * @property {Date} watchStart - start date of the watching period
 * @property {Date} watchEnd - start date of the watching period
 * @property {string} description - body of the bulletin
 * @property {string} source - source of the bulletin
 * @property {Date} pubDate - publication date of bulletin
 * @property {Coordinates} coordinates - Coordinate of the activity reported in bulletin
 */
export interface Bulletin {
    volcano: string,
    country: string,
    status: string,
    watchStart: Date,
    watchEnd: Date,
    description: string,
    source?: string,
    pubDate: Date,
    coordinates: Coordinates,
}

/**
 * Type for a bulletin query for the database
 * @property {string} volcano - volcano name
 * @property {string} country - country where the volcano is located
 * @property {string | null} watchstart - start date of the watching period
 * @property {string | null} watchend - start date of the watching period
 * @property {string} description - body of the bulletin
 * @property {string | null} source - source of the bulletin
 * @property {string | null} pubDate - publication date of bulletin
 * @property {string | null} latitude - latitude of the activity reported in bulletin
 * @property {string | null} longitude - longitude of the activity reported in bulletin
 */
export interface BulletinQuery {
    volcanoid: number,
    countryid: number,
    status: string,
    watchstart?: string | null,
    watchend?: string | null,
    description: string,
    source?: string | null,
    pubdate: string | null,
    latitude?: string | null,
    longitude?: string | null,
}

/**
 * Type for a volcano
 * @property {string} name - Volcano name
 * @property {string} volcanoType - Volcano type
 * @property {string} country - Country where the volcano is located
 * @property {number | null} lastEruption - Volcano last known eruption year
 * @property {Eruption | null} eruptions - List of volcano known eruptions
 * @property {number} altitude - Volcano elevation
 * @property {Coordinates} coordinates - Coordinate of the activity reported in bulletin
 */
export interface Volcano {
    name: string,
    volcanoType: string,
    country: string | null,
    lastEruption: number | null;
    smithsonianid: number | null,
    altitude: number | null,
    coordinates: Coordinates,
    slug: string
}

/**
 * Type for a volcano
 * @property {string} name - Volcano name
 * @property {string} volcanoType - Volcano type
 * @property {string} country - Country where the volcano is located
 * @property {number | null} lastEruption - Volcano last known eruption year
 * @property {Eruption | null} eruptions - List of volcano known eruptions
 * @property {number} altitude - Volcano elevation
 * @property {string | null} latitude - latitude of the volcano
 * @property {string | null} longitude - longitude of the volcano
 * @property {number | null} smithsonianid - id of the volcano in the smithsonian database
 */
export interface VolcanoQuery {
    name: string,
    countryid: number | null,
    type: string,
    lasteruption: number | null,
    altitude: number | null,
    latitude: string | null, // numeric est consideré comme une string
    longitude: string | null,  // numeric est consideré comme une string
    smithsonianid: number | null,
    slug: string
}

/**
 * Type for a volcano
 * @property {string} name - Volcano name
 * @property {string | null} country - Country where the volcano is located
 * @property {string} type - Volcano type
 * @property {number | null} lastEruption - Volcano last known eruption year
 * @property {number} altitude - Volcano elevation
 * @property {string | null} latitude - latitude of the volcano
 * @property {string | null} longitude - longitude of the volcano
 * @property {number | null} smithsonianid - id of the volcano in the smithsonian database
 */
export interface VolcanoResponse {
    name: string,
    country: string | null,
    volcanoType: string,
    lasteruption: number | null,
    altitude: number | null,
    latitude: string | null, // numeric est consideré comme une string
    longitude: string | null,  // numeric est consideré comme une string
    smithsonianid: number | null,
    slug: string
}

export interface Eruption {
    volcanoid: number | null,
    startdate: string,
    enddate: string | null,
    uncertaintystartdate: string | null,
    uncertaintyenddate: string | null,
    confirmed: boolean,
    type: string | null,
    vei: number | null,
    episodes: Episode[] | null,
}

export interface Episode {
    startdate: string | null,
    enddate: string | null,
    location: string | null,
    sourceofconf: string | null,
    typeoferuption: string | null,
    events: EruptiveEvent[] | null
}

export interface EruptiveEvent {
    startdate: string | null,
    enddate: string | null,
    eventtype: string,
    remarks: string | null,
}

export interface EruptionQuery {
    volcanoid: number,
    startdate: string | null,
    enddate: string | null,
    uncertaintystartdate: string | null,
    uncertaintyenddate: string | null,
    confirmed: boolean,
    type: string | null,
    vei: number | null
}

export interface EpisodeQuery {
    eruptionid: number,
    startdate: string | null,
    enddate: string | null,
    location: string | null,
    sourceofconf: string | null,
    typeofepisode: string | null,
}

export interface EruptiveEventQuery {
    episodeid: number,
    startdate: string | null,
    enddate: string | null,
    eventtype: string | null,
    remarks: string | null,
}