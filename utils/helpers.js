const checkbox = async (page, selector, checked) => {
    const element = await page.$(selector);
    const isChecked = await element.getProperty('checked');
    
    if (checked && !isChecked || !checked && isChecked) {
        await page.click(selector);
    }
}

module.exports.checkbox = checkbox;