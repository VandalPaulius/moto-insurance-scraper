const cwd = require('cwd');
const utils = require(cwd('utils'));

const homeToLogin = async (page) => {
    const selectors = {
        signIn: 'body > header > div > div > div > ul > li > a',
    }
    
    await page.click(selectors.signIn);
    await utils.timing.loaded(page);
}

module.exports = homeToLogin;
