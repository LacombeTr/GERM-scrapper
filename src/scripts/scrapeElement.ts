import "dotenv/config";
import { scrapePage } from "../utils/scrapePage";

const fetchedElementPage = async () => {
    const fetchedPage = await scrapePage(
        `${process.env.SCRAPING_BASE_URL}/e:1/`
    );

    return fetchedPage;
};

const main = async () => {
    try {
        const fetchedPage = await fetchedElementPage();

        console.log(fetchedPage);
    } catch (error) {
        console.error("Error fetching the page:", error);
    }
};

main();
