import {Coordinates} from "../types";

/**
 * Class containing methods for parsing bulletin elements from a Cheerios object
 */
export class BulletinParsers {

    static months: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    /**
     * Parse the title to extract the volcano, the country, the start and end date of the watch session
     * the title as to be in the "Volcano Name (Country) - Report for DD Month-DD Month YYYY"
     * @param {string} title - <title> tag of the bulletin as a string
     */
    public static parseTitle(title: string) {

        const volcanoRegEx = /^([A-Za-z0-9\s\-]+)/;
        const countryRegEx = /\(([^)]+)\)/;
        const dateRegEx = /(\d{1,2}) (\w+)-(\d{1,2}) (\w+)\s*(\d{4})/;
        const statusRegEx = /\w+$/;

        const volcanoFound = title.match(volcanoRegEx)
        const countryFound = title.match(countryRegEx)
        const dateFound = title.match(dateRegEx)
        const statusFound = title.match(statusRegEx)

        let volcanoName: string = '';
        let country: string = '';
        let startDate: Date = new Date('January 1, 1900');
        let endDate: Date = new Date('January 1, 1900');
        let status: string = '';

        if (volcanoFound && countryFound && dateFound && statusFound) {
            volcanoName = volcanoFound[1].trim().toString();
            country = countryFound[1].trim().toString();
            startDate = new Date(`${dateFound[2].toString()} ${dateFound[1].toString()}, ${dateFound[5].toString()}`)
            endDate = new Date(`${dateFound[4].toString()} ${dateFound[3].toString()}, ${dateFound[5].toString()}`)
            status = statusFound.toString() === "NEW" ? "New" : "Continuing"
        }

        return {
            volcanoName: volcanoName,
            country: country,
            dates: [startDate, endDate],
            status: status,
        }
    }

    /**
     * Parse the description to extract the bulletin body and source(s)
     * @param {string} description - <desc> tag of the bulletin as a string
     */
    public static parseDesc(desc: string) {
        const blocsRegEx = /<p>([\s\S]*?)<\/p>/g;

        let description: string = '';
        let source: string = '';

        const descriptionAndSource = desc.match(blocsRegEx);

        if (descriptionAndSource) {
            description = descriptionAndSource[0].replace("<p>", "").replace("</p>", "").replace(/\n+/g, '\\n').trim();

            if (descriptionAndSource[1]) {
                source = descriptionAndSource[1].replace(/<p>Source: |<p>Sources: |<\/p>/g, '').trim();
            }
        }

        return {
            description: description,
            source: source
        }
    }

    /**
     * Parse the pubDate to extract bulletin publication date
     * @param {string} pubDate - <pubDate> tag of the bulletin as a string
     */
    public static parsePubDate(pubDate: string) {

        const dateRegEx = /(\d{2}) (\w*) (\d{4}) (\d{2}):(\d{2}):(\d{2}) ([-+]\d{2})(\d{2})/;
        let parsedDate: Date = new Date('January 1, 1900');

        try{
            const pubDateFound = pubDate.match(dateRegEx);

            if (pubDateFound){
                const [, day, monthStr, year, hours, minutes, seconds, timezone, timezoneMins] = pubDateFound;
                parsedDate = new Date(`${year}-${BulletinParsers.months[monthStr].toString().padStart(2, '0')}-${day}T${hours}:${minutes}:${seconds}${timezone}:${timezoneMins}`);
            }
        } catch(error){
            console.log(error)
        }

        return parsedDate;
    }

    /**
     * Parse the coordinates to extract bulletin activity GPS coordinates
     * @param {string} pubDate - <geoRSS:point> tag of the bulletin as a string
     */
    public static parsePosition(coordinates: string): Coordinates{
        const coordinatesRegEx = /([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/;

        const coordinatesFound = coordinates.match(coordinatesRegEx);

        if(coordinatesFound && coordinatesFound.length === 3){
            const coordinates: Coordinates = [Number(coordinatesFound[1]), Number(coordinatesFound[2])]

            return coordinates;
        } else {
            console.error('Coordinates not found.');
            return [null, null]
        }
    }
}