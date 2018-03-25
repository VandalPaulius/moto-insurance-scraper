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

module.exports.checkbox = checkbox;
module.exports.typeClean = typeClean;
