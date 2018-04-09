const cwd = require('cwd');
const utils = require(cwd('utils'));

const removeSuperfluousQuotes = async (page) => {
    const selectors = {
        motorbike: '#more-info-menu > li:nth-child(3) > div',
        deleteQuote: elementId => `#your-quotes-content > div:nth-child(${elementId}) > div > div.quote-summary-title > a`,
        confirmDelete: '#remove-quotes-modal > div.container.small > div > div > div > div.modalbuttoncontainer > a.modalbutton.confirm.removequoteyes.btnYes.btn-yes.has-loading-placeholder'
    }

    const classNames = {
        quote: 'quote-summary-inner'
    }

    await page.click(selectors.motorbike);

    const quoteCount = await page.evaluate(quote => {
        return Object.keys(
            document.getElementsByClassName(quote)
        ).length;
    }, classNames.quote)

    if (quoteCount > 1) { // one quote should always stay
        for (let i = 0; i < (quoteCount - 1); i++) {
            await page.click(selectors.deleteQuote(4 + i)); // first quote is 4th element
            await utils.timing.loaded(page);
            await page.click(selectors.confirmDelete);
            await utils.timing.loaded(page);
        }
    }
}

module.exports = removeSuperfluousQuotes;