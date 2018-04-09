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

    await scraper.scrape({
        scrapeId,
        inputRange,
        scrapeOptions: true,
        db
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

module.exports = scrapeOptions;