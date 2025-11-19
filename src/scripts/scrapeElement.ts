import "dotenv/config";
import { scrapePage } from "../utils/scrapePage";
import { ElementValue } from "../types";

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
                    : null,
                element: cells[2]?.textContent?.trim() || "",
                value: cells[3]?.textContent?.trim()
                    ? cells[3].textContent.trim()
                    : null,
                median: cells[4]?.textContent?.trim()
                    ? cells[4].textContent.trim()
                    : null,
                sd: cells[5]?.textContent?.trim()
                    ? cells[5].textContent.trim()
                    : null,
                low: cells[6]?.textContent?.trim()
                    ? cells[6].textContent.trim()
                    : null,
                high: cells[7]?.textContent?.trim()
                    ? cells[7].textContent?.trim()
                    : null,
                analysisNumber: cells[8]?.textContent?.trim()
                    ? parseFloat(cells[8].textContent?.trim())
                    : null,
                unit: cells[9]?.textContent?.trim() || null,
                info: cells[10]?.textContent?.trim() || null,
                reference: cells[11]?.textContent?.trim() || null,
                referenceURL: cells[11]?.querySelector("a")?.href || null,
                source: cells[12]?.textContent?.trim() || null,
                sourceURL: cells[12]?.querySelector("a")?.href || null,
            };
        });
    }
};

scrapeElements();
