const puppeteer = require('puppeteer');
const cwd = require('cwd');
const utils = require(cwd('utils'));
const navigation = require(cwd('navigation'));

const scrape = async ({
    scrapeId,
    debug = false,
    scrapeOptions = false,
    inputRange,
    headless = false,
    slowMo = 0,
    loadTime = 2000
}) => {
    console.log('scrape it');

    if (scrapeOptions) {
        utils.database.saveToDb({
            type: 'scrapeOptionsInputRange',
            data: {
                scrapeId,
                inputRange
            }
        })
    } else {
        utils.database.saveToDb({
            type: 'inputRange',
            data: {
                scrapeId,
                inputRange
            }
        }) // populate database with input ranges for one scrape
    }
   
    const quotes = []

    const browser = await puppeteer.launch({
        headless,
        slowMo: slowMo // for fully operational mode
    });
    const page = await browser.newPage();

    if (debug) {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }
    
    await page.setViewport({width: 1200, height: 500})
    await page.goto(process.env.URL_TO_SCRAPE);

    await navigation.main.homeToLogin(page);

    await utils.timing.loaded(page, loadTime);
    await navigation.main.login(page);
    await utils.timing.show(page, loadTime);

    await navigation.dashboard.removeSuperfluousQuotes(page);

    await navigation.dashboard.newQuote(page);

    await navigation.details.quoteDetails(
        page,
        utils.database,
        scrapeId,
        true,
        false, // scrapeOptions,
        inputRange
    );
    await utils.timing.loaded(page, loadTime);
    await navigation.details.riderDetails(
        page,
        utils.database,
        scrapeId,
        true,
        false, // scrapeOptions,
        inputRange
    );
    await utils.timing.loaded(page, loadTime);
    await navigation.details.bikeDetails(
        page,
        utils.database,
        scrapeId,
        true,
        scrapeOptions
    );
    // await utils.timing.loaded(page, loadTime);
    // await navigation.details.coverDetails(
    //     page,
    //     utils.database,
    //     scrapeId,
    //     true,
    //     scrapeOptions
    // );

    if (!scrapeOptions) {
        await utils.timing.loaded(page, loadTime);
        const quotes = await navigation.quotes.getQuotes(
            page,
            utils.database,
            scrapeId
        );
        await navigation.main.logout(page, true);
    }

    await browser.close();

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
