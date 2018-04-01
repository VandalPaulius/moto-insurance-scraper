const checkbox = async (page, selector, checked) => {
    const element = await page.$(selector);
    const isChecked = await element.getProperty('checked');
    
    if (checked && !isChecked || !checked && isChecked) {
        await page.click(selector);
    }
}

const typeClean = async (page, selector, value) => {
    await page.click(selector);

    await page.evaluate((selector) => {
        document.querySelector(selector).value = '';
    }, selector)

    await page.keyboard.type(value);
}

const getOptions = async (page, selector) => {
    return await page.evaluate((selector) => {
        const optionList = document.querySelector(selector);
        const optionKeys = Object.keys(optionList);

        const options = optionKeys.map(key => {
            return {
                value: optionList[key].value,
                text: optionList[key].text
            }
        })

        return options;
    }, selector);
}

const selectYesNo = async (page, selectors, yes) => {
    if (yes) {
        await page.click(selectors.yes);
    } else {
        await page.click(selectors.no);
    }
}

module.exports.checkbox = checkbox;
module.exports.typeClean = typeClean;
module.exports.getOptions = getOptions;
module.exports.selectYesNo = selectYesNo;
