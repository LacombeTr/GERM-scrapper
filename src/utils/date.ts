export class DateParsers {

    /**
     * Parse start and end date of an eruption
     * @param dateString
     */
    public static eruptionDateParser(dateString: string) {

        dateString = dateString.replace('[', '').replace(']', '').replace('(?)', '').trim();

        if (dateString === '') {
            return [null, null, null, null]
        }

        let start: string | null = null;
        let end: string | null = null;
        let startDate: string | null = null;
        let endDate: string | null = null;
        let uncertaintyStartDate: string | null = null;
        let uncertaintyEndDate: string | null = null;

        [start, end] = dateString.split('-')

        start !== undefined ? [startDate, uncertaintyStartDate] = start.split('±') : [startDate, uncertaintyStartDate] = [null, null]
        end !== undefined ? [endDate, uncertaintyEndDate] = end.split('±') : [endDate, uncertaintyEndDate] = [null, null]

        startDate ? startDate = startDate.trim() : startDate;
        endDate ? endDate = endDate.trim() : endDate;

        uncertaintyStartDate ? uncertaintyStartDate = uncertaintyStartDate.trim() : uncertaintyStartDate = null;
        uncertaintyEndDate ? uncertaintyEndDate = uncertaintyEndDate.trim() : uncertaintyEndDate = null;

        const bceRegEx = /(BCE)$/

        startDate?.match(bceRegEx) ? startDate = Number("-" + startDate.replace("BCE", "").trim()).toString() : startDate;
        endDate?.match(bceRegEx) ? endDate = Number("-" + endDate.replace("BCE", "").trim()).toString() : endDate;

        startDate?.toLowerCase() === "unknown" ? startDate = null : startDate
        endDate?.toLowerCase() === "unknown" ? endDate = null : endDate

        return [startDate, uncertaintyStartDate, endDate, uncertaintyEndDate];
    }
}