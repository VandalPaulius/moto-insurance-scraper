const puppeteer = require('puppeteer');
const cwd = require('cwd');
const utils = require(cwd('utils'));
const navigation = require(cwd('navigation'));

const scrape = async ({
    scrapeId,
    debug = false,
    scrapeOptions = false,
    inputRange,
    loadTime = 2000,
    db,
    browser
}) => {
    console.log('scrape it');

    if (scrapeOptions) {
        await utils.database.saveToDb(
            db,
            {
                type: 'scrapeOptionsInputRange',
                data: {
                    scrapeId,
                    inputRange
                }
            }
        )
    } else {
        await utils.database.saveToDb(
            db,
            {
                type: 'inputRange',
                data: {
                    scrapeId,
                    inputRange
                }
            }
        ) // populate database with input ranges for one scrape
    }
   
    const quotes = []

    const page = await browser.newPage();

    if (debug) {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }
    
    await page.setViewport({width: 1200, height: 500})
    await page.goto(process.env.URL_TO_SCRAPE);

    await navigation.main.homeToLogin(page);

    await utils.timing.loaded(page, loadTime);
    console.log(`${scrapeId}: starting 'login'`);
    await navigation.main.login(page);
    await utils.timing.show(page, loadTime);
    console.log(`${scrapeId}: finished 'login'`);

    await navigation.dashboard.removeSuperfluousQuotes(page);

    await navigation.dashboard.newQuote(page);

    await utils.timing.loaded(page, loadTime);
    console.log(`${scrapeId}: starting 'quoteDetails'`);
    await navigation.details.quoteDetails(
        page,
        utils.database,
        db,
        scrapeId,
        true,
        scrapeOptions,
        inputRange,
        true // scrapeFewBikes :dev @ scrapeOptions
    );
    console.log(`${scrapeId}: finished 'quoteDetails'`);
    await utils.timing.loaded(page, loadTime);
    console.log(`${scrapeId}: starting 'riderDetails'`);
    await navigation.details.riderDetails(
        page,
        utils.database,
        db,
        scrapeId,
        true,
        scrapeOptions,
        inputRange
    );
    console.log(`${scrapeId}: finished 'riderDetails'`);
    await utils.timing.loaded(page, loadTime);
    console.log(`${scrapeId}: starting 'bikeDetails'`);
    await navigation.details.bikeDetails(
        page,
        utils.database,
        db,
        scrapeId,
        true,
        scrapeOptions,
        inputRange
    );
    console.log(`${scrapeId}: finished 'bikeDetails'`);
    await utils.timing.loaded(page, loadTime);
    console.log(`${scrapeId}: starting 'coverDetails'`);
    await navigation.details.coverDetails(
        page,
        utils.database,
        db,
        scrapeId,
        scrapeOptions ? false: true, // continue to next
        scrapeOptions,
        inputRange
    );
    console.log(`${scrapeId}: finished 'coverDetails'`);
    if (!scrapeOptions) {
        await utils.timing.loaded(page, loadTime);
        console.log(`${scrapeId}: starting 'getQuotes'`);
        const quotes = await navigation.quotes.getQuotes(
            page,
            utils.database,
            scrapeId
        );
        await navigation.main.logout(page, true);
    }

    if (scrapeOptions) {
        return true;
    } else {
        return {
            quotes,
            scrapeId
        };
    }
}

module.exports.scrape = scrape;
