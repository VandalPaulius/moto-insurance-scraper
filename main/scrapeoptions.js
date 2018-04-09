const scrapeOptions = async (db) => {
    const cwd = require('cwd');
    const scraper = require(cwd('scraper'));
    const utils = require(cwd('utils'));
    const uuidv1 = require('uuid/v1');

    const scrapeId = uuidv1();
    const inputRange = utils.initialInputValues.initialInputValues;
    const startedAt = new Date;

    // const collection = await db.collection('SCRAPE_OPTIONS');

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
        slowMo,
        loadTime
    }) => {
        await scraper.scrape({
            scrapeId,
            inputRange,
            scrapeOptions: true,
            db,
            slowMo,
            loadTime
        }).then(async (response) => {
            if (!response) {
                console.log('Option scraping failed.');
                console.log('DATABASE: ', utils.database.getDb());
            }
    
            const endedAt = new Date;
            await utils.database.saveToDb(
                db,
                    {
                    type: 'scrapeOptionsSaveEndedDate',
                    data: {
                        scrapeId,
                        endedAt
                    }
                }
            )
            console.log('Options scraped!');
            console.log('DATABASE: ', utils.database.getDb());
        });
    }

    const retries = parseInt(process.env.OPTIONS_SCRAPE_RETRIES);

    for (let i = 0; i < retries; i++) {
        try {
            let slowMo = 20;
            let loadTime = 2000;

            if (i > 0) { // slow down to prevent fatal errors on network failures
                slowMo = slowMo * ( i + 2 );
                loadTime = loadTime * ( i + 2 );
            }

            await scrape({
                slowMo,
                loadTime
            });

            console.log('Options scraped successfully');
            break;
        } catch(error) {
            let message = '';
            let shouldBreak;

            if (i < retries) {
                message = 'Retrying...';
            } else {
                message = 'Exiting with error.';
                shouldBreak = true;
            }

            console.error(`Failed to scrape options! ${message}`);
            if (shouldBreak) {
                break;
            }
        }
    }
}

module.exports = scrapeOptions;
