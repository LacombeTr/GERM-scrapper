import Root = cheerio.Root;
import Cheerio = cheerio.Cheerio;
import {DateParsers} from "./date";
import {Episode, EruptiveEvent} from "../types";

export class EruptionParser {

    public static eruptionInfosParser(eruptionInfo: Cheerio, dom: Root) {

        let vei: number | null = null;
        let eruptionType: string | null = null;
        let confirmed: boolean = false;

        const statusElem = eruptionInfo.contents()[0]
        const veiElem = eruptionInfo.contents()[1]

        const statusRegEx = /^\w+\s\w+/
        const typeRegEx = /\((.+)\)$/

        const rawStatus = dom(statusElem).text().toString()
        const foundStatus = rawStatus.match(statusRegEx)
        const foundType = rawStatus.match(typeRegEx)

        const veiRegEx = /\d$/
        const rawVEI = dom(veiElem).text().toString()
        const foundVEI = rawVEI.match(veiRegEx)

        if (!foundStatus) {
            confirmed = false;
        } else {
            const status = foundStatus.toString()
            if (status.toLowerCase() === 'confirmed eruption') {
                confirmed = true;
            }
        }

        foundType ? eruptionType = foundType[1].toString() : null;
        foundVEI ? vei = Number(foundVEI.toString().trim()) : null

        return {
            confirmed: confirmed,
            type: eruptionType,
            vei: vei,
        }
    }

    public static episodeInfoParser(episodes: Cheerio, dom: Root) {

        const episodesElementList = episodes.find(".EpisodeTable")

        let episodesList: Episode[] = []

        for (const episodeElement of episodesElementList.toArray()) {
            let sourceLocation: string | null = null;
            let evidence: string | null = null;
            let eruptionType: string | null = null;

            const [episodeHeaderElement, sourceLocationElement, dateElement, evidenceElement] =
                dom(episodeElement).find('thead > tr > th')

            const eventElementList = dom(episodeElement).find('tbody > tr > td > .events-accordion > .EventsTable > table > tbody > tr')

            const rawEpisodeHeader = dom(episodeHeaderElement).contents().text().toString()
            const rawDate = dom(dateElement).contents().text().toString()
            const rawSourceLocation = dom(sourceLocationElement).contents().text().toString()
            const rawEvidence = dom(evidenceElement).contents().text().toString()

            const foundEruptionType = rawEpisodeHeader.match(/\((.+)\)/)

            rawEpisodeHeader.length !== 0 && foundEruptionType ? eruptionType = foundEruptionType[1].toString().trim() : eruptionType

            const [startDate, , endDate] =
                DateParsers.eruptionDateParser(rawDate);

            rawSourceLocation.length !== 0 ? sourceLocation = rawSourceLocation.trim() : sourceLocation
            rawEvidence.length !== 0 ? evidence = rawEvidence.split(":")[rawEvidence.split(":").length - 1].trim() : evidence

            const events = this.eventParser(eventElementList, dom)

            const episode = {
                startdate: startDate,
                enddate: endDate,
                location: sourceLocation,
                sourceofconf: evidence,
                typeoferuption: eruptionType,
                events: events
            }

            episodesList.push(episode)

        }

        return episodesList
    }

    public static eventParser(events: Cheerio, dom: Root) {

        const eventList: EruptiveEvent[] = []

        for (let eventElement of events) {

            const [, startDateElement, endDateElement, eventTypeElement, remarksElement] =
                dom(eventElement).find('td')

            const rawStartDate = dom(startDateElement).contents().text().toString()
            const rawEndDate = dom(endDateElement).contents().text().toString()
            const rawEventType = dom(eventTypeElement).contents().text().toString()
            const rawRemarks = dom(remarksElement).contents().text().toString()

            const startDate = DateParsers.eruptionDateParser(rawStartDate)[0]
            const endDate = DateParsers.eruptionDateParser(rawEndDate)[2]
            const remarks = rawRemarks

            const event = {
                startdate: startDate === '' ? null : startDate,
                enddate: endDate === '' ? null : endDate,
                eventtype: rawEventType,
                remarks: remarks === '' ? null : remarks,
            }

            eventList.push(event)
        }

        return eventList

    }
}