const cwd = require('cwd');
const scraper = require(cwd('scraper'));
const utils = require(cwd('utils'));
const puppeteer = require('puppeteer');

const getRunArguments = () => {
    const runArguments = {}

    process.argv.map((arg) => {
        const argBroken = arg.split('=');

        if (arg === '--get-last') {
            runArguments.getLast = true;
        } else if (
            argBroken[0] === '--batch-id'
            && typeof argBroken[1] === 'string'
        ) {
            runArguments.batchId = argBroken[1];
        }
    });

    return runArguments;
}

const scrape = async ({
    loadTime,
    browser,
    scrapeId,
    db,
    tryCount
}) => {
    console.log(`${scrapeId} Try ${tryCount}: Starting quote scraping.`);

    console.log(`${scrapeId} Try ${tryCount}: Getting input values from database.`);
    const inputRange = await utils.database.getInputRange({
        db,
        scrapeId
    });
    console.log(`${scrapeId} Try ${tryCount}: Input values got.`);

    await scraper.scrape({
        scrapeId,
        inputRange,
        db,
        loadTime,
        browser
    }).then(async ({ quotes, scrapeId }) => {
        console.log(`${scrapeId} Try ${tryCount}: Quote scraping completed successfully.`);
        console.log(`${scrapeId} Try ${tryCount}: Saving quotes to database.`);
        // await utils.database.saveToDb(
        //     db,
        //         {
        //         type: 'SCRAPE_QUOTES__SAVE_QUOTES',
        //         data: {
        //             scrapeId,
        //             quotes
        //         }
        //     }
        // );

        // await utils.database.saveToDb(
        //     db,
        //         {
        //         type: 'SCRAPE_QUOTES__SAVE_FINISHED_DATE',
        //         data: {
        //             scrapeId,
        //             finishedAt: new Date
        //         }
        //     }
        // );
        console.log(`${scrapeId} Try ${tryCount}: Quote saving finished successfully`);
    });
}

const scrapeQuotes = async (db, headless = false) => {
    const runArguments = getRunArguments();

    console.log('Getting scrapeIds from database.');
    const scrapeIds = await utils.database.getScrapeIds(
        db,
        {
            batchId: runArguments.batchId,
            getLast: runArguments.getLast
        }
    )
    console.log('Got scrapeIds.');

    const retries = parseInt(process.env.OPTIONS_SCRAPE_RETRIES);

    console.log('Starting quote scraping.');

    for (
        let scrapeIdIndex = 0;
        scrapeIdIndex < scrapeIds.length;
        scrapeIdIndex++
    ) {
        let scrapeId = scrapeIds[scrapeIdIndex];
        console.log(`Starting scrape: ${scrapeIdIndex + 1} of ${scrapeIds.length}. scrapeId: ${scrapeId}`);

        for (let i = 0; i < retries; i++) {
            let browser = {};
    
            try {
                let slowMo = 20;
                let loadTime = 2000;
    
                if (i > 0) { // slow down to prevent fatal errors on network failures
                    slowMo = slowMo * ( i + 2 );
                    loadTime = loadTime * ( i + 2 );
                }
    
                browser = await puppeteer.launch({
                    headless: headless, // dev = false, prod = true,
                    slowMo: slowMo // for fully operational mode
                });
    
                await scrape({
                    loadTime,
                    browser,
                    scrapeId,
                    db,
                    tryCount: i
                });
    
                await browser.close();
                break;
            } catch(error) {
                try {
                    await browser.close();
                } catch (err) {
                    console.error(`${scrapeId} Try ${i}: Cannot close browser.`);
                };
                
                let message = '';
                let shouldBreak;
    
                if (i < retries) {
                    message = 'Retrying...';
                } else {
                    message = 'Exiting with error.';
                    shouldBreak = true;
                }
    
                console.error(`${scrapeId} Try ${i}: Failed to scrape quotes! ${message}`);
                console.error(`${scrapeId} Try ${i}: Error: ${error}`);
                if (shouldBreak) {
                    break;
                }
            }
        }

        console.log(`Finished scrape: ${scrapeIdIndex + 1} of ${scrapeIds.length}. scrapeId: ${scrapeId}`);
    }
}

module.exports = scrapeQuotes;
