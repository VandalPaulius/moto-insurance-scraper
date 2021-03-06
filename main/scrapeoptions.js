const scrapeOptions = async (db, headless = true) => {
    const cwd = require('cwd');
    const scraper = require(cwd('scraper'));
    const utils = require(cwd('utils'));
    const uuidv4 = require('uuid/v4');
    const puppeteer = require('puppeteer');

    const scrapeId = uuidv4();
    const inputRange = utils.initialInputValues.initialInputValues;
    const startedAt = new Date;

    await utils.database.saveToDb(
        db,
        {
            type: 'scrapeOptionsSaveStartedDate',
            data: {
                scrapeId,
                startedAt
            }
        }
    );

    const scrape = async ({
        loadTime,
        browser
    }) => {
        await scraper.scrape({
            scrapeId,
            inputRange,
            scrapeOptions: true,
            db,
            loadTime,
            browser
        }).then(async (response) => {
            if (!response) {
                console.log('Option scraping failed.');
                console.log('DATABASE: ', utils.database.getDb());
            }
    
            const finishedAt = new Date;
            await utils.database.saveToDb(
                db,
                    {
                    type: 'scrapeOptionsSaveEndedDate',
                    data: {
                        scrapeId,
                        finishedAt
                    }
                }
            )
            console.log('Options scraped!');
            console.log('DATABASE: ', utils.database.getDb());
        });
    }

    const retries = parseInt(process.env.OPTIONS_SCRAPE_RETRIES);

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
                browser
            });

            await browser.close();

            console.log('Options scraped successfully');
            break;
        } catch(error) {
            try {
                await browser.close();
            } catch (err) {
                console.error('Cannot close browser.');
            };
            
            let message = '';
            let shouldBreak;

            if (i < retries) {
                message = 'Retrying...';
            } else {
                message = 'Exiting with error.';
                shouldBreak = true;
            }

            console.error(`Failed to scrape options! ${message}     Error: ${error}`);
            if (shouldBreak) {
                break;
            }
        }
    }
}

module.exports = scrapeOptions;
