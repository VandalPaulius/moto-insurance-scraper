process.env.NODE_PATH = __dirname;
require('dotenv').config()
const puppeteer = require('puppeteer');

const utils = require('./utils');
const navigation = require('./navigation');

const inputRange = {
    quoteDetails: {
        personalDetails: {
            title: ['Mr', 'Miss'], // 'all'; [0, 2]
            maritalStatus: ['Married', 'Single'], // 'all'; [0, 1]
            ukResidentFrom: { // 'birth'
                month: 12,
                year: 1990
            },
            fullTimeEmployment: ['Employed', 'Unemplyed', 'Self-Emplyed'], // 'all'; [0, 1, 8]
        },
        partTimeEmploymentLess16Hrs: false, // true,
        licenceType: ['UK Full Bike', 'EU Full Bike'], // 'all'; [0, 5],
        selectedLicenceLength: ['Less than 1', '1'], // 'all'; [0, 1],
    }
}

const scrape = async () => {
    console.log('scrape it');
    const browser = await puppeteer.launch({
        headless: false,
        //slowMo: 1000 // for fully operational mode
    });
    const page = await browser.newPage();

    await page.setViewport({width: 1200, height: 500})
    await page.goto(process.env.URL_TO_SCRAPE);

    await navigation.main.homeToLogin(page);

    await navigation.main.login(page);
    await utils.timing.show(page);

    await navigation.dashboard.removeSuperfluousQuotes(page);

    await navigation.dashboard.newQuote(page);

    // await navigation.main.logout(page);
    // await browser.close();
}

scrape().then((values) => {
    console.log('values: ', values);
});