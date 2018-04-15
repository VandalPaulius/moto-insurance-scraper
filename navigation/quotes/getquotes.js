const cwd = require('cwd');
const utils = require(cwd('utils'));

const getQuotes = async (page, db, scrapeId) => {
    const selectors = {
        loadingDialog: 'body > div.fancybox-wrap.fancybox-default.fancybox-opened > div.fancybox-outer',
        resultsTable: '#divresultsgridplacement > div > span:nth-child(1) > table > tbody',
        resultTableItem: [
            '#divresultsgridplacement > div > span:nth-child(1) > table > tbody > tr:nth-child(',
            ') > td > table > tbody > tr'
        ]
    };

    const waitForLoad = async () => {
        let run = true;
        
        await page.waitFor(1000); // to not bash CPU

        while (run) {
            run = await page.$(selectors.loadingDialog);
            await page.waitFor(1000); // to not bash CPU
        }
    };

    const clearQuoteNumbers = (quotes) => {
        const clearNumber = (rawString) => {
            const outputStringRaw = [];
            let number = false;

            rawString.split('').map((part) => {
                if (number) {
                    outputStringRaw.push(part);
                }
                if (part === '£') {
                    number = true;
                }
            })

            let outputString = outputStringRaw.filter((item, index) => {
                if (item !== ',') {
                    return item;
                }
            }).join('');

            return parseFloat(outputString);
        }

        return quotes.map((quote) => {
            if (!quote.price) {
                return quote;
            }

            const fixedNumbersQuote = { ...quote };

            if (quote.price) {
                fixedNumbersQuote.price = {
                    full: clearNumber(quote.price.full),
                    excess: clearNumber(quote.price.excess)
                }
    
                if (quote.price.monthly) {
                    fixedNumbersQuote.price.monthly = {
                        deposit: clearNumber(quote.price.monthly.deposit),
                        total: clearNumber(quote.price.monthly.total),
                        month: quote.price.monthly.month
                    }
                }
            }

            return fixedNumbersQuote;
        })
    }

    await waitForLoad();
    
    const quotes = await page.evaluate(({
            resultsTable,
            resultTableItem
        }) => {
        const getOptionsRaw = () => {
            const options = document
                .querySelector(resultsTable).children;

            const optionKeys = Object.keys(options);

            const optionsClean = [];
            
            for (let i = 0; i < optionKeys.length; i++) {
                const patternAl = new RegExp('resultsgridaltrow','i');
                const patternSpecial = new RegExp('resultsgridspecialofferrow','i');
                const patternStandard = new RegExp('resultsgridrow','i');

                if (patternAl.test(options[optionKeys[i]].innerHTML)) {
                    optionsClean.push({
                        option: options[optionKeys[i]],
                        flavor: 'AL'
                    });
                } else if (patternSpecial.test(options[optionKeys[i]].innerHTML)) {
                    optionsClean.push({
                        option: options[optionKeys[i]],
                        flavor: 'SPECIAL'
                    });
                } else if (patternStandard.test(options[optionKeys[i]].innerHTML)) {
                    optionsClean.push({
                        option: options[optionKeys[i]],
                        flavor: 'STANDARD'
                    });
                }
            }
            return optionsClean;
        }

        const optionsRaw = getOptionsRaw();

        const options = optionsRaw.map((optionRaw) => {
            const itemSelector = (number) => `tr > td > table > tbody > tr > td:nth-child(${number})`;
            const getElement = (number, selectors = '') => optionRaw.option.querySelector(`${itemSelector(number)}${selectors}`)

            const data = {
                insurer: {
                    name: getElement(2, ' > div > img ').title,
                    logo: getElement(2, ' > div > img ').src
                }
            }

            let hasPrice = true;

            try {
                getElement(3, ' > div:nth-child(1)').innerText
            } catch (error) {
                hasPrice = false;
            }

            if (hasPrice) {
                data.price = {
                    full: getElement(3, ' > div:nth-child(1)').innerText,
                    monthly: {
                        deposit: getElement(3, ' > div:nth-child(2) > div:nth-child(3)').innerText,
                        month: getElement(3, ' > div:nth-child(2) > div:nth-child(5)').innerText,
                        total: getElement(3, ' > div:nth-child(2) > div:nth-child(7)').innerText
                    },
                    excess: getElement(4, ' > div').innerText
                }
                data.coverType = getElement(9, '').innerText;
            }

            return data;
        });
        
        return options;
    }, {
        resultsTable: selectors.resultsTable,
        resultTableItem: selectors.resultTableItem
    });

    return clearQuoteNumbers(quotes);
};

module.exports = getQuotes;
