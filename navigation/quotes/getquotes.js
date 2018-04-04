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
        do {
            try {
                await page.waitFor(2000); // to not bash CPU
                await page.click(selectors.loadingDialog);
            } catch (error) {
                await page.waitFor(2000); // wait for loading modal disappear
                return;
            }
        } while (true);
    };

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
            // const itemSelector = {
            //     special: (number) => `tr > td > table > tbody > tr > td:nth-child(${number})`

            //     //<td><table class="resultsgridrow"><tbody><tr class="resultsgriddatarow">

            //     //     #divresultsgridplacement > div > span:nth-child(1) > table > tbody > tr:nth-child(',
            //     // ') > td > table > tbody > tr'
            // }


            // console.error('optionRaw.option', optionRaw.option)
            // try {
            //     console.log('SPECIAL optionRaw.option.querySelector(itemSelector.special)', optionRaw.option.querySelector(itemSelector.special(2)))
            // } catch(err) {

            // }
            
            // if (optionRaw.flavor === 'SPECIAL') {
            //     console.log('SPECIAL optionRaw.option.querySelector(itemSelector.special)', optionRaw.option.querySelector(itemSelector.special(2)))
            //     // MODIFY SELECTOR BY FLAVOR
            // }
            // if (optionRaw.flavor === 'STANDARD') {
            //     console.log('STANDARD optionRaw.option.querySelector(itemSelector.special)', optionRaw.option.querySelector(itemSelector.special(2)))
            //     // MODIFY SELECTOR BY FLAVOR
            // }
            // if (optionRaw.flavor === 'AL') {
            //     console.log('optionRaw.option.querySelector(itemSelector.special)', optionRaw.option.querySelector(itemSelector.special(2)))
            //     // MODIFY SELECTOR BY FLAVOR
            // }




            // const itemSelector = (number) => `tr > td > table > tbody > tr > td:nth-child(${number})`;
            const itemSelector = (number) => `tr > td > table > tbody > tr > td:nth-child(${number}) > div`;
            //<td><table class="resultsgridrow"><tbody><tr class="resultsgriddatarow">

            //     #divresultsgridplacement > div > span:nth-child(1) > table > tbody > tr:nth-child(',
            // ') > td > table > tbody > tr'


            const getElement = (selectors = '') => optionRaw.option.querySelector(`${itemSelector(2)} ${selectors}`)

            const data = {
                insurerName: getElement('> img ').title,
                insurerLogo: getElement('> img ').src
            }

            return data;
        });
        
        return options;
    }, {
        resultsTable: selectors.resultsTable,
        resultTableItem: selectors.resultTableItem
    });

    console.log('quotes: ', quotes, 'length: ', quotes.length);
};

module.exports = getQuotes;
