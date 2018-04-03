const show = async (page, howLong = 5000) => {
    await page.waitFor(howLong);
}

const loaded = async (page, howLong = 2000) => {
    return page.waitFor(howLong);
}

function waitBlocking(time) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    return;
}

module.exports.show = show;
module.exports.loaded = loaded;
module.exports.waitBlocking = waitBlocking;
