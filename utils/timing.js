const show = async (page, howLong = 5000) => {
    await page.waitFor(howLong);
}

const loaded = async (page, howLong = 2000) => {
    return page.waitFor(howLong);
}

module.exports.show = show;
module.exports.loaded = loaded;