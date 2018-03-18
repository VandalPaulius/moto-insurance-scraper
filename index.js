require('dotenv').config()
const puppeteer = require('puppeteer');

const show = async (page, howLong = 5000) => {
    await page.waitFor(howLong);
}

const loaded = async (page, howLong = 2000) => {
    return page.waitFor(howLong);
}

const homeToLogin = async (page) => {
    const selectors = {
        signIn: 'body > header > div > div > div > ul > li > a',
    }
    
    await page.click(selectors.signIn);
    await loaded(page);
}

const login = async (page) => {
    const selectors = {
        username: '#form0 > div:nth-child(3) > span.editor-field',
        password: '#Password',
        dob: {
            year: '#DateOfBirth_Year',
            month: '#DateOfBirth_Month',
            day: '#DateOfBirth_Day'
        },
        rememberMe: '#RememberMe',
        signIn: '#form0 > div.login-continue-button > input'
    }
    
    await page.click(selectors.username);
    await page.keyboard.type(process.env.GO_COMPARE_USERNAME);

    await page.click(selectors.password);
    await page.keyboard.type(process.env.GO_COMPARE_PASSWORD);

    const dob = process.env.GO_COMPARE_DOB.split('-');

    await page.click(selectors.dob.day);
    await page.keyboard.type(dob[2]);
    await page.click(selectors.dob.month);
    await page.keyboard.type(dob[1]);
    await page.click(selectors.dob.year);
    await page.keyboard.type(dob[0]);

    await page.click(selectors.rememberMe);

    await page.click(selectors.signIn);
}

const scrape = async () => {
    console.log('scrape it');
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 1000 // for fully operational mode
    });
    const page = await browser.newPage();

    await page.setViewport({width: 1000, height: 500})
    await page.goto(process.env.URL_TO_SCRAPE);

    await homeToLogin(page);

    console.log('dalykai')
    await login(page);
    await show(page);

    //browser.close();
}

scrape().then((values) => {
    console.log('values: ', values);
});