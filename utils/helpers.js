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

const removePleaseSelect = (list) => {
    const pattern = new RegExp('Please select', 'ig')

    return list.filter(item => {
        if (!pattern.test(item.text)) {
            return item;
        }
    });
}

const selectYesNo = async (page, selectors, yes) => {
    if (yes) {
        await page.click(selectors.yes);
    } else {
        await page.click(selectors.no);
    }
}

const getNumberList = (fromRaw, toRaw, step = 1) => {
    let from;
    let to;
    const list = [];

    if (typeof fromRaw === 'string') {
        from = parseInt(fromRaw);
    } else {
        from = fromRaw;
    }

    if (typeof toRaw === 'string') {
        to = parseInt(toRaw);
    } else {
        to = toRaw;
    }

    for (let i = 0; i <= (to - from); i = i + step) {
        list.push(`${from + i}`);
    }

    return list;
}

const removeArrayDuplicates = (listWithDuplicates) => {
    if (!(listWithDuplicates instanceof Array)) {
        return [];
    }

    const listWithDuplicatesStrings = listWithDuplicates
        .map(item => JSON.stringify(item));
    const listnODuplicatesStrings = Array
        .from(new Set(listWithDuplicatesStrings));
    return listnODuplicatesStrings.map(itemString => JSON.parse(itemString))
}

module.exports.checkbox = checkbox;
module.exports.typeClean = typeClean;
module.exports.getOptions = getOptions;
module.exports.selectYesNo = selectYesNo;
module.exports.removePleaseSelect = removePleaseSelect;
module.exports.getNumberList = getNumberList;
module.exports.removeArrayDuplicates = removeArrayDuplicates;
