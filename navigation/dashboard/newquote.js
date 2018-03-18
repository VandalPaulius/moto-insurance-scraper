const cwd = require('cwd');
const utils = require(cwd('utils'));

const newQuote = async (page) => {
    const selectors = {
        newQuoteButton: '#your-quotes-content > div.title-container > div > div.quote-header-links > a'
    }

    await page.click(selectors.newQuoteButton);
    await utils.timing.loaded(page);
}

module.exports = newQuote;