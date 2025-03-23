import {DateParsers} from "../../utils/date";

describe('Eruption date parser', () => {

    const cases: Array<[string, Array<string | null>]> = [
        ["1991 Apr 1 ± 15 days - 1991 Oct 31 ± 7 days", ["1991 Apr 1", "15 days", "1991 Oct 31", "7 days"]],
        ["1991 Apr 1 - 1991 Oct 31 ± 7 days", ["1991 Apr 1", null, "1991 Oct 31", "7 days"]],
        ["1991 Apr 1 ± 15 days - 1991 Oct 31", ["1991 Apr 1", "15 days", "1991 Oct 31", null]],
        ["1991 Apr 1 - 1991 Oct 31", ["1991 Apr 1", null, "1991 Oct 31", null]],
        ["1991 Apr 1 ± 15 days", ["1991 Apr 1", "15 days", null, null]],
        ["1991 Apr 1", ["1991 Apr 1", null, null, null]],

        ["8060 BCE ± 100 years", ["-8060", "100 years", null, null]],
        ["8060 BCE", ["-8060", null, null, null]],

        ["[ 2022 May 15 - 2022 May 15 ]", ["2022 May 15", null, "2022 May 15", null]],
        ["[ 4500 BCE ]", ["-4500", null, null, null]],
        ["[ 4500 BCE (?)]", ["-4500", null, null, null]]
    ]

    test.each(cases)('parsing %s', (dateString, dateArray) => {

        expect(DateParsers.eruptionDateParser(dateString)).toEqual(dateArray)
        console.log(DateParsers.eruptionDateParser(dateString))
    })

})