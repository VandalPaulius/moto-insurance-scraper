require('dotenv').config()
const puppeteer = require('puppeteer');

const show = async (page) => {
    await page.waitFor(10000);
}

const scrape = async () => {
    console.log('scrape it');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(process.env.URL_TO_SCRAPE);
    show(page);

    browser.close();
}

scrape().then((values) => {
    console.log('values: ', values);
});