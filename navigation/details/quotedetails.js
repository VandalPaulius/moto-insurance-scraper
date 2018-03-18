const cwd = require('cwd');
const utils = require(cwd('utils'));

const personal = async (page) => {
    const selectors = {
        newQuoteButton: '#your-quotes-content > div.title-container > div > div.quote-header-links > a'
    }

    
} 

const quoteDetails = async (page) => {
    await personal(page);

    
}

module.exports = quoteDetails;