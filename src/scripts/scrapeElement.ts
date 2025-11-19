import "dotenv/config";
import { scrapePage } from "../utils/scrapePage";
import { ElementValue } from "../types";
import { drizzle } from "drizzle-orm/node-postgres/driver";
import { elementValues } from "../db/schema";

const fetchedElementPage = async (elementnumber: number) => {
    const fetchedPage = await scrapePage(
        `${process.env.SCRAPING_BASE_URL}/e:${elementnumber}/`
    );

    return fetchedPage;
};

const db = drizzle(process.env.DATABASE_URL!);

const scrapeElements = async () => {
    for (let atomicNumber = 1; atomicNumber <= 92; atomicNumber++) {
        console.log(`Scraping element with atomic number: ${atomicNumber}`);
        let fetchedPage: Document | undefined;

        try {
            fetchedPage = await fetchedElementPage(atomicNumber);
        } catch (error) {
            console.error("Error fetching the page:", error);
        }

        if (fetchedPage) {
            fetchedPage
                .querySelectorAll('tr[valign="top"]')
                .forEach(async (row) => {
                    const cells = row.querySelectorAll("td");
                    const elementData: ElementValue = {
                        reservoir: cells[0]?.textContent?.trim() || "",
                        z: atomicNumber,
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
                        referenceURL:
                            cells[11]?.querySelector("a")?.href || null,
                        source: cells[12]?.textContent?.trim() || null,
                        sourceURL: cells[12]?.querySelector("a")?.href || null,
                    };

                    if (elementData.element) {
                        try {
                            await db.insert(elementValues).values(elementData);
                        } catch (error) {
                            console.error(
                                "Database connection error:\n",
                                error
                            );
                            return;
                        }
                    }
                });
        }
    }
};

scrapeElements();
