const cwd = require('cwd');
const utils = require(cwd('utils'));

const bikeInfo = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        purchaseDate: {
            notBought: '#ctl00_cphBody_qsVehicleDetails_qPurchaseDate_chkCheckBox',
            year: '#ctl00_cphBody_qsVehicleDetails_qPurchaseDate_tbYear',
            month: '#ctl00_cphBody_qsVehicleDetails_qPurchaseDate_tbMonth'
        },
        sideCar: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qFittedWithSideCar_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qFittedWithSideCar_rbAnswer2'
        },
        includePillion: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qPillionUsed_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qPillionUsed_rbAnswer2'
        },
        usedToTow: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qUsedToTow_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qUsedToTow_rbAnswer2'
        },
        previouslyInsured: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qPreviouslyInsured_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qPreviouslyInsured_rbAnswer2'
        },
        modified: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qModified_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qModified_rbAnswer2'
        },
        bikeValue: '#ctl00_cphBody_qsVehicleDetails_qVehicleValue_tbAnswer',
        bikeOvernightParking: '#ctl00_cphBody_qsVehicleDetails_qParkedOvernight_cboAnswer',
        bikeImported: '#ctl00_cphBody_qsVehicleDetails_qImported_cboAnswer',
        registeredKeeper: '#ctl00_cphBody_qsVehicleDetails_qRegisteredKeeper_cboAnswer',
        legalOwner: '#ctl00_cphBody_qsVehicleDetails_qLegalOwner_cboAnswer'
    };

    // first column
    const isSelected = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element.checked;
    }, selectors.purchaseDate.notBought);

    if (inputRange.purchaseDate.alreadyBought) {
        
        if (isSelected) {
            await page.click(selectors.purchaseDate.notBought);
        }
        
        await utils.helpers.typeClean(
            page,
            selectors.purchaseDate.month,
            inputRange.purchaseDate.month
        );
        await utils.helpers.typeClean(
            page,
            selectors.purchaseDate.year,
            inputRange.purchaseDate.year
        );
    } else {
        if (!isSelected) {
            await page.click(selectors.purchaseDate.notBought);
        }
    }

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.sideCar.yes,
            no: selectors.sideCar.no
        },
        inputRange.sideCar
    );

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.includePillion.yes,
            no: selectors.includePillion.no
        },
        inputRange.sideincludePillionCar
    );

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.usedToTow.yes,
            no: selectors.usedToTow.no
        },
        inputRange.usedToTow
    );

    if (inputRange.purchaseDate.alreadyBought) {
        await utils.helpers.selectYesNo(
            page,
            {
                yes: selectors.previouslyInsured.yes,
                no: selectors.previouslyInsured.no
            },
            inputRange.previouslyInsured
        );
    }
    
    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.modified.yes,
            no: selectors.modified.no
        },
        inputRange.modified
    ); // no implementation of modification dialog yet

    // second column
    await utils.helpers.typeClean(
        page,
        selectors.bikeValue,
        inputRange.bikeValue
    );

    await page.select(
        selectors.bikeOvernightParking,
        inputRange.bikeOvernightParking.value
    );

    await page.select(
        selectors.bikeImported,
        inputRange.bikeImported.value
    );

    await page.select(
        selectors.registeredKeeper,
        inputRange.registeredKeeper.value
    );

    await page.select(
        selectors.legalOwner,
        inputRange.legalOwner.value
    );
}

const bikeInfoScrapeOptions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        purchaseDate: {
            notBought: '#ctl00_cphBody_qsVehicleDetails_qPurchaseDate_chkCheckBox',
            year: '#ctl00_cphBody_qsVehicleDetails_qPurchaseDate_tbYear',
            month: '#ctl00_cphBody_qsVehicleDetails_qPurchaseDate_tbMonth'
        },
        sideCar: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qFittedWithSideCar_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qFittedWithSideCar_rbAnswer2'
        },
        includePillion: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qPillionUsed_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qPillionUsed_rbAnswer2'
        },
        usedToTow: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qUsedToTow_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qUsedToTow_rbAnswer2'
        },
        previouslyInsured: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qPreviouslyInsured_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qPreviouslyInsured_rbAnswer2'
        },
        modified: {
            yes: '#ctl00_cphBody_qsVehicleDetails_qModified_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleDetails_qModified_rbAnswer2'
        },
        bikeValue: '#ctl00_cphBody_qsVehicleDetails_qVehicleValue_tbAnswer',
        bikeOvernightParking: '#ctl00_cphBody_qsVehicleDetails_qParkedOvernight_cboAnswer',
        bikeImported: '#ctl00_cphBody_qsVehicleDetails_qImported_cboAnswer',
        registeredKeeper: '#ctl00_cphBody_qsVehicleDetails_qRegisteredKeeper_cboAnswer',
        legalOwner: '#ctl00_cphBody_qsVehicleDetails_qLegalOwner_cboAnswer'
    };

    // first column
    const isSelected = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element.checked;
    }, selectors.purchaseDate.notBought);

    if (inputRange.purchaseDate.alreadyBought) {
        
        if (isSelected) {
            await page.click(selectors.purchaseDate.notBought);
        }
        
        await utils.helpers.typeClean(
            page,
            selectors.purchaseDate.month,
            inputRange.purchaseDate.month
        );
        await utils.helpers.typeClean(
            page,
            selectors.purchaseDate.year,
            inputRange.purchaseDate.year
        );
    } else {
        if (!isSelected) {
            await page.click(selectors.purchaseDate.notBought);
        }
    }

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.sideCar.yes,
            no: selectors.sideCar.no
        },
        inputRange.sideCar
    );

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.includePillion.yes,
            no: selectors.includePillion.no
        },
        inputRange.sideincludePillionCar
    );

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.usedToTow.yes,
            no: selectors.usedToTow.no
        },
        inputRange.usedToTow
    );

    if (inputRange.purchaseDate.alreadyBought) {
        await utils.helpers.selectYesNo(
            page,
            {
                yes: selectors.previouslyInsured.yes,
                no: selectors.previouslyInsured.no
            },
            inputRange.previouslyInsured
        );
    }
    
    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.modified.yes,
            no: selectors.modified.no
        },
        inputRange.modified
    ); // no implementation of modification dialog yet

    // second column
    await utils.helpers.typeClean(
        page,
        selectors.bikeValue,
        inputRange.bikeValue
    );

    await page.select(
        selectors.bikeOvernightParking,
        inputRange.bikeOvernightParking.value
    );

    await page.select(
        selectors.bikeImported,
        inputRange.bikeImported.value
    );

    await page.select(
        selectors.registeredKeeper,
        inputRange.registeredKeeper.value
    );

    await page.select(
        selectors.legalOwner,
        inputRange.legalOwner.value
    );

    // options scrape

    const options = {
        purchaseDate: {
            alreadyBought: [
                true,
                false
            ],
            year: {
                from: '1900',
                to: '2018'
            },
            month: {
                from: '1',
                to: '12'
            }
        },
        sideCar: [
            true,
            false
        ],
        includePillion: [
            true,
            false
        ],
        usedToTow: [
            true,
            false
        ],
        previouslyInsured: [
            true,
            false
        ],
        modified: [
            false
        ],
        bikeValue: {
            from: '1',
            to: '100000'
        },
        bikeOvernightParking: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.bikeOvernightParking)),
        bikeImported: await utils.helpers.getOptions(page, selectors.bikeImported),
        registeredKeeper: await utils.helpers.getOptions(page, selectors.registeredKeeper),
        legalOwner: await utils.helpers.getOptions(page, selectors.legalOwner)
    };

    return options;
}

const bikeSecurity = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        alarmImmobilizer: {
            inputField: '#ctl00_cphBody_qsVehicleSecurity_qImmobAlarm_tbAnswer',
            list: 'body > ul:nth-child(5)',
            listItem: 'body > ul:nth-child(5) > li.ui-menu-item:nth-child(${number})',
            listItemAnchor: (number) => `body > ul:nth-child(5) > li.ui-menu-item:nth-child(${number + 1}) > a`
        },
        mechanicalSecurity: {
            inputField: '#ctl00_cphBody_qsVehicleSecurity_qPhysicalSecurity_tbAnswer',
            list: 'body > ul:nth-child(6)',
            listItem: 'body > ul:nth-child(6) > li.ui-menu-item:nth-child(${number})',
            listItemAnchor: (number) => `body > ul:nth-child(6) > li.ui-menu-item:nth-child(${number + 1}) > a`
        },
        secureMarkingsDropdown: '#ctl00_cphBody_qsVehicleSecurity_qSecureMarkings_cboAnswer',
        trackerDropdown: '#ctl00_cphBody_qsVehicleSecurity_qTracker_cboAnswer'
    };

    const selectWeirdListItem = async (page, selector, immobilizer) => {
        const getIndex = async (page, selector, item) => {
            return await page.evaluate((selector, item) => {
                const optionList = document
                    .querySelector(selector.list)
                    .children;

                for (let i = 0; i < optionList.length; i++) {
                    const dataContainer = optionList[i].querySelector('a');

                    const pattern = new RegExp(item, 'i');

                    if (pattern.test(dataContainer.innerText)) {
                        return i;
                    }
                }
            }, selector, item);
        };

        const itemIndex = await getIndex(page, selector, immobilizer);

        await page.click(selector.listItemAnchor(itemIndex));
    }

    await page.click(selectors.mechanicalSecurity.inputField);
    await selectWeirdListItem(
        page,
        selectors.mechanicalSecurity,
        inputRange.mechanicalSecurity
    );

    await page.click(selectors.alarmImmobilizer.inputField);
    await selectWeirdListItem(
        page,
        selectors.alarmImmobilizer,
        inputRange.alarmImmobilizer
    );

    await page.select(
        selectors.secureMarkingsDropdown,
        inputRange.secureMarkings.value
    );

    await page.select(
        selectors.trackerDropdown,
        inputRange.tracker.value
    );
}

const bikeSecurityScrapeOptions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        alarmImmobilizer: {
            inputField: '#ctl00_cphBody_qsVehicleSecurity_qImmobAlarm_tbAnswer',
            list: 'body > ul:nth-child(5)',
            listItem: 'body > ul:nth-child(5) > li.ui-menu-item:nth-child(${number})',
            listItemAnchor: (number) => `body > ul:nth-child(5) > li.ui-menu-item:nth-child(${number + 1}) > a`
        },
        mechanicalSecurity: {
            inputField: '#ctl00_cphBody_qsVehicleSecurity_qPhysicalSecurity_tbAnswer',
            list: 'body > ul:nth-child(6)',
            listItem: 'body > ul:nth-child(6) > li.ui-menu-item:nth-child(${number})',
            listItemAnchor: (number) => `body > ul:nth-child(6) > li.ui-menu-item:nth-child(${number + 1}) > a`
        },
        secureMarkingsDropdown: '#ctl00_cphBody_qsVehicleSecurity_qSecureMarkings_cboAnswer',
        trackerDropdown: '#ctl00_cphBody_qsVehicleSecurity_qTracker_cboAnswer'
    };    

    const selectWeirdListItem = async (page, selector, immobilizer) => {
        const getIndex = async (page, selector, item) => {
            return await page.evaluate((selector, item) => {
                const optionList = document
                    .querySelector(selector.list)
                    .children;

                for (let i = 0; i < optionList.length; i++) {
                    const dataContainer = optionList[i].querySelector('a');

                    const pattern = new RegExp(item, 'i');

                    if (pattern.test(dataContainer.innerText)) {
                        return i;
                    }
                }
            }, selector, item);
        };

        const itemIndex = await getIndex(page, selector, immobilizer);

        await page.click(selector.listItemAnchor(itemIndex));
    }

    await page.click(selectors.mechanicalSecurity.inputField);
    await selectWeirdListItem(
        page,
        selectors.mechanicalSecurity,
        inputRange.mechanicalSecurity
    );

    await page.click(selectors.alarmImmobilizer.inputField);
    await selectWeirdListItem(
        page,
        selectors.alarmImmobilizer,
        inputRange.alarmImmobilizer
    );

    await page.select(
        selectors.secureMarkingsDropdown,
        inputRange.secureMarkings.value
    );

    await page.select(
        selectors.trackerDropdown,
        inputRange.tracker.value
    );


    const getWeirdListOptions = async (page, selector) => {
        return await page.evaluate((selector) => {
            const optionList = document.querySelector(selector);
            const optionKeys = Object.keys(optionList.children);

            const options = optionKeys.map((key) => {
                return optionList.children[key].innerText;
            })
    
            return options;
        }, selector);
    }

    // options scrape

    const options = {
        alarmImmobilizer: await getWeirdListOptions(page, selectors.alarmImmobilizer.list),
        mechanicalSecurity: await getWeirdListOptions(page, selectors.mechanicalSecurity.list),
        secureMarkings: await utils.helpers.getOptions(page, selectors.secureMarkingsDropdown),
        tracker: await utils.helpers.getOptions(page, selectors.trackerDropdown)
    };

    return options;
}

const bikeDetails = async (page, db, dbInstance, scrapeId, continueToNext, scrapeOptions, inputRange) => {
    const selectors = {
        continueToNext: '#ctl00_btnNext'
    }

    if (scrapeOptions) {
        const bikeDetails = { // still need bikeInfo
            bikeInfo: await bikeInfoScrapeOptions(
                page,
                db,
                scrapeId,
                inputRange.bikeDetails.bikeInfo
            ),
            bikeSecurity: await bikeSecurityScrapeOptions(
                page,
                db,
                scrapeId,
                inputRange.bikeDetails.bikeSecurity
            )
        }

        console.log(bikeDetails);

        await db.saveToDb(
            dbInstance,
            {
                type: 'scrapeOptions',
                data: {
                    scrapeId,
                    name: 'bikeDetails',
                    options: bikeDetails
                }
            }
        );
    } else {
        await bikeInfo(
            page,
            db,
            scrapeId,
            inputRange.bikeDetails.bikeInfo
        );
    
        await bikeSecurity(
            page,
            db,
            scrapeId,
            inputRange.bikeDetails.bikeSecurity
        );
    }

    if (continueToNext) {
        await page.click(selectors.continueToNext);
    }
}

module.exports = bikeDetails;