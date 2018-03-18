const logout = async (page) => {
    const selectors = {
        signOut: 'body > header > div.header-content.fullwidth > div > div > div.sign-out-header > a'
    }

    await page.click(selectors.signOut);
}

module.exports = logout;
