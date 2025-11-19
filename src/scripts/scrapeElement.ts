import "dotenv/config";
import { scrapePage } from "../utils/scrapePage";
import { log } from "console";

type ElementValue = {
    reservoir: string;
    z: number | undefined;
    element: string;
    value: number | undefined;
    median: number | undefined;
    sd: number | undefined;
    low: number | undefined;
    high: number | undefined;
    analysisNumber: number | undefined;
    unit: string | undefined;
    info: string | undefined;
    reference: string | undefined;
    referenceURL: string | undefined;
    source: string | URL | undefined;
    sourceURL: string | URL | undefined;
};

const fetchedElementPage = async () => {
    const fetchedPage = await scrapePage(
        `${process.env.SCRAPING_BASE_URL}/e:1/`
    );

    return fetchedPage;
};

const scrapeElements = async () => {
    let fetchedPage: Document | undefined;

    try {
        fetchedPage = await fetchedElementPage();
    } catch (error) {
        console.error("Error fetching the page:", error);
    }

    if (fetchedPage) {
        let table: ElementValue[];

        // console.log(fetchedPage)
        fetchedPage.querySelectorAll('tr[valign="top"]').forEach((row) => {
            const cells = row.querySelectorAll("td");
            const elementData: ElementValue = {
                reservoir: cells[0]?.textContent?.trim() || "",
                z: cells[1]?.textContent?.trim()
                    ? parseFloat(cells[1].textContent.trim())
                    : undefined,
                element: cells[2]?.textContent?.trim() || "",
                value: cells[3]?.textContent?.trim()
                    ? parseFloat(cells[3].textContent.trim())
                    : undefined,
                median: cells[4]?.textContent?.trim()
                    ? parseFloat(cells[4].textContent.trim())
                    : undefined,
                sd: cells[5]?.textContent?.trim()
                    ? parseFloat(cells[5].textContent.trim())
                    : undefined,
                low: cells[6]?.textContent?.trim()
                    ? parseFloat(cells[6].textContent.trim())
                    : undefined,
                high: cells[7]?.textContent?.trim()
                    ? parseFloat(cells[7].textContent?.trim())
                    : undefined,
                analysisNumber: cells[8]?.textContent?.trim()
                    ? parseFloat(cells[8].textContent?.trim())
                    : undefined,
                unit: cells[9]?.textContent?.trim() || undefined,
                info: cells[10]?.textContent?.trim() || undefined,
                reference: cells[11]?.textContent?.trim() || undefined,
                referenceURL: cells[11]?.querySelector("a")?.href || undefined,
                source: cells[12]?.textContent?.trim() || undefined,
                sourceURL: cells[12]?.querySelector("a")?.href || undefined,
            };
        });
    }
};

scrapeElements();
