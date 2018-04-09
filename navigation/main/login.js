const login = async (page) => {
    const selectors = {
        username: '#form0 > div:nth-child(3) > span.editor-field',
        password: '#Password',
        dob: {
            year: '#DateOfBirth_Year',
            month: '#DateOfBirth_Month',
            day: '#DateOfBirth_Day'
        },
        rememberMe: '#RememberMe',
        signIn: '#form0 > div.login-continue-button > input'
    }
    
    await page.click(selectors.username);
    await page.keyboard.type(process.env.GO_COMPARE_USERNAME);

    await page.click(selectors.password);
    await page.keyboard.type(process.env.GO_COMPARE_PASSWORD);

    const dob = process.env.GO_COMPARE_DOB.split('-');

    await page.click(selectors.dob.day);
    await page.keyboard.type(dob[2]);
    await page.click(selectors.dob.month);
    await page.keyboard.type(dob[1]);
    await page.click(selectors.dob.year);
    await page.keyboard.type(dob[0]);

    await page.click(selectors.rememberMe);

    await page.click(selectors.signIn);
}

module.exports = login;
