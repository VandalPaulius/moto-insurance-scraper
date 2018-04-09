const logout = async (page, fromQuotes) => {
    const selectors = {
        signOutMain: 'body > header > div.header-content.fullwidth > div > div > div.sign-out-header > a',
        signOutQuotes: '#ctl00_signOutButton_btnSignOut'
    }

    if (!fromQuotes) {
        await page.click(selectors.signOutMain);
    } else {
        await page.click(selectors.signOutQuotes);
    }
}

module.exports = logout;
