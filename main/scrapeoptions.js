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
    )

    return 

    scraper.scrape({
        scrapeId,
        inputRange,
        scrapeOptions: true
    }).then((response) => {
        if (!response) {
            console.log('Option scraping failed.');
            console.log('DATABASE: ', utils.database.getDb());
        }

        const endedAt = new Date;
        utils.database.saveToDb({
            type: 'scrapeOptionsSaveEndedDate',
            data: {
                scrapeId,
                startedAt
            }
        })
        console.log('Options scraped!');
        console.log('DATABASE: ', utils.database.getDb());
    });
}

module.exports = scrapeOptions;
