const cwd = require('cwd');
const utils = require(cwd('utils'));

const personal = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        titleDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qTitle_cboAnswer',
        maritalStatus: '#ctl00_cphBody_qsProposerPersonalDetails_qMaritalStatus_cboAnswer',
        ukResidentFrom: {
            checkbox: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_chkCheckBox',
            month: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_tbMonth',
            year: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_tbYear'
        },
        employmentDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qFullTimeEmploymentStatus_cboAnswer',
        partTimeEmployment: {
            yes: '#ctl00_cphBody_qsProposerPersonalDetails_qPartTimeEmployment_rbAnswer1',
            no: '#ctl00_cphBody_qsProposerPersonalDetails_qPartTimeEmployment_rbAnswer2'
        },
        licenceType: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceType_cboAnswer',
        howLongLicence: {
            year: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerYears',
            month: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerMonths'
        }
    }

    // First column
    await page.select(
        selectors.titleDropdown,
        inputRange.title.value
    );

    await page.select(
        selectors.maritalStatus,
        inputRange.maritalStatus.value
    );

    const isSelected = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element.checked;
    }, selectors.ukResidentFrom.checkbox);

    if (inputRange.ukResidentFrom.birth && isSelected) {
        await page.click(selectors.ukResidentFrom.checkbox);
    } else if (!inputRange.ukResidentFrom.birth && !isSelected) {
        await page.click(selectors.ukResidentFrom.checkbox);
    }

    if (inputRange.ukResidentFrom.birth) {
        await utils.helpers.typeClean(
            page,
            selectors.ukResidentFrom.year,
            inputRange.ukResidentFrom.year
        );

        await utils.helpers.typeClean(
            page,
            selectors.ukResidentFrom.month,
            inputRange.ukResidentFrom.month
        );
    }

    // Second column
    await page.select(
        selectors.employmentDropdown,
        inputRange.fullTimeEmployment.value
    );

    if (inputRange.partTimeEmploymentLess16Hrs) {
        await page.click(selectors.partTimeEmployment.yes);
    } else {
        await page.click(selectors.partTimeEmployment.no);
    }

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    );

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    );


    await page.select(
        selectors.howLongLicence.year,
        inputRange.selectedLicenceLength.year.value
    );
    if (inputRange.selectedLicenceLength.year.text === 'Less than 1') {
        await page.select(
            selectors.howLongLicence.month,
            inputRange.selectedLicenceLength.month.value
        );
    }
};

const address = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        postCode: '#ctl00_cphBody_qsAddressDetails_qPostcode_tbAnswer',
        findAddressButton: '#ctl00_cphBody_qsAddressDetails_btnAddressLookupButton_btnAddressLookup',
        addressDropdown: '#ctl00_cphBody_qsAddressDetails_qAddress_cboAnswer',
        mainPhone: '#ctl00_cphBody_qsAddressDetails_qDaytimeTel_tbAnswer',
        additionalPhone: '#ctl00_cphBody_qsAddressDetails_qEveningTel_tbAnswer',
        keptAtMainAdress: {
            yes: '#ctl00_cphBody_qsAddressDetails_qKeptOvernight_rbAnswer1',
            no: '#ctl00_cphBody_qsAddressDetails_qKeptOvernight_rbAnswer2'
        },
        overNightPostCode: '#ctl00_cphBody_qsAddressDetails_qOvernightPostcode_tbAnswer',
        addressLoading: '#ctl00_cphBody_qsAddressDetails_btnAddressLookupButton_ucPleaseWait_divPleaseWait'
    }

    const selectAddress = async (page, selector, inputRangeAddress) => {
        const findAddress = (addresses, address) => {
            const addressCleared = address.replace(/[^a-zA-Z0-9-\s]+/g, '');

            const addressParts = addressCleared.split(' ');
            const abbreviations = {
                Rd: 'Road',
                Ave: 'Avenue',
                Ln: 'Lane',
                Dr: 'Drive',
                St: 'Street'
            }

            const addressPartsFixed = addressParts.map(addressItem => {
                for (let key of Object.keys(abbreviations)) {
                    if (key === addressItem) {
                        return abbreviations[key];
                    }
                }
                
                return addressItem;
            });

            let outputAddress;
            let error;

            try {
                for (let address of addresses) {
                    let match = [];
    
                    for (let i = 0; i < addressPartsFixed.length; i++) {
                        const pattern = new RegExp(addressPartsFixed[i], 'i');
    
                        match[i] = pattern.test(address.text);
                    }
    
                    const matchedCount = match.filter(item => item === true).length;

                    if (matchedCount === addressPartsFixed.length) {
                        outputAddress = address;
                        break;
                    }
                }
            } catch (err) {
                error = err;
            }

            if (error) {
                console.error(error);
                console.error('Error while selecting exact address. Trying approximation.');
            }
            
            if (!outputAddress || !address) {
                outputAddress = addresses[Math.floor(addresses.length / 2)]; // if nothing matches take approximate address
            }

            return outputAddress;
        }

        const getOptions = async (page, selector) => {
            const options = await page.evaluate((selector) => {
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

            return options;
        }

        const options = await utils.helpers.getOptions(page, selector);
        const address = findAddress(options, inputRangeAddress);

        await page.select(selector, address.value);
    }

    const waitForLoadAddresses = async (selector) => {
        let loading = true;
        
        await page.waitFor(100); // to not bash CPU

        while (loading) {
            loading = await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                const display = element.style.display;

                if (display === 'none') {
                    return false;
                } else {
                    return true;
                }
            }, selector);
            await page.waitFor(100); // to not bash CPU
        }
    };

    await utils.helpers.typeClean(
        page,
        selectors.postCode,
        inputRange.address.postCode.value
    )

    await page.click(selectors.findAddressButton);
    await waitForLoadAddresses(selectors.addressLoading);

    await selectAddress(page, selectors.addressDropdown, inputRange.address.address.value);

    await utils.helpers.typeClean(
        page,
        selectors.mainPhone,
        inputRange.mainPhone.value
    );

    if (inputRange.additionalPhone) {
        await utils.helpers.typeClean(
            page,
            selectors.additionalPhone,
            inputRange.additionalPhone.value
        );
    }
    
    if (inputRange.keptAtMainAddress) {
        await page.click(selectors.keptAtMainAdress.yes);
    } else {
        await page.click(selectors.keptAtMainAdress.no);

        await utils.helpers.typeClean(
            page,
            selectors.overNightPostCode,
            inputRange.overNightPostCode.value
        );
    }
};

const bikeDetails = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        knowRegNumber: {
            yes: '#ctl00_cphBody_qsVehicleSelection_qKnowRegNo_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleSelection_qKnowRegNo_rbAnswer2'
        },
        bikeMake: '#ctl00_cphBody_qsVehicleSelection_qVehicleMake_cboAnswer',
        manufactureYear: '#ctl00_cphBody_qsVehicleSelection_qYearOfMan_tbAnswer',
        engineSize: {
            isElectric: '#ctl00_cphBody_qsVehicleSelection_qEngineSizeCC_chkCheckBox',
            engineCC: '#ctl00_cphBody_qsVehicleSelection_qEngineSizeCC_tbAnswer'
        },
        findVehicleButton: '#ctl00_cphBody_qsVehicleSelection_btnVehicleLookupDontKnowRegButton_btnVehicleLookup',
        vehicleDropdown: '#ctl00_cphBody_qsVehicleSelection_qConfirmVehicleDontKnowReg_cboAnswer'
    }

    const selectMake = async (page, selector, bikeMake) => {
        const options = await utils.helpers.getOptions(page, selector)

        let brand;
        const regex = (pattern) => new RegExp(`(${pattern})(?!.)`, 'i');
        
        for (let option of options) {
            if(regex(bikeMake).test(option.text)) {
                // workaround for RegExp 'lookbehind' non existance in Javascript
                const optionTextBackwards = option.text
                    .split('')
                    .reverse()
                    .join('');
                const bikeMakeBackwards = bikeMake
                    .split('')
                    .reverse()
                    .join('');

                if (regex(bikeMakeBackwards).test(optionTextBackwards)) {
                    brand = option;
                }
            }
        }

        await page.select(selector, brand.value);
    }

    const selectBike = async (page, selector, bike, manufactureYear) => {
        const options = await utils.helpers.getOptions(page, selector);

        let match;
        const pattern = new RegExp(bike, 'i');

        for (let option of options) {
            if (pattern.test(option.text)) {
                match = option;
                break;
            }
        }

        await page.select(selector, match.value);
    }

    if (inputRange.knowRegNumber) {
        await page.click(selectors.knowRegNumber.yes);
    } else {
        await page.click(selectors.knowRegNumber.no);
    }

    await selectMake(page, selectors.bikeMake, inputRange.bikeMake.value);

    await utils.helpers.typeClean(
        page,
        selectors.manufactureYear,
        inputRange.manufactureYear
    );

    if (inputRange.engineSize.isElectric) {
        await page.click(selectors.engineSize.isElectric);
    } else {
        await utils.helpers.typeClean(
            page,
            selectors.engineSize.engineCC,
            inputRange.engineSize.engineCC
        );
    }

    await page.click(selectors.findVehicleButton);
    await utils.timing.loaded(page);

    await selectBike(page, selectors.vehicleDropdown, inputRange.bike.text);
};

const coverDetails = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        coverType: '#ctl00_cphBody_qsCoverDetails_qTypeOfCover_cboAnswer',
        bikeNoClaims: '#ctl00_cphBody_qsCoverDetails_qNCB_cboAnswer',
        ridersCount: '#ctl00_cphBody_qsCoverDetails_qNoOfDrivers_cboAnswer',
        bikeUse: '#ctl00_cphBody_qsCoverDetails_qUseOfVehicle_cboAnswer'
    }

    // first column
    await page.select(
        selectors.coverType,
        inputRange.coverType.value
    );

    await page.select(
        selectors.bikeNoClaims,
        inputRange.bikeNoClaims.value
    );

    // second column
    await page.select(
        selectors.ridersCount,
        inputRange.ridersCount.value
    );

    await page.select(
        selectors.bikeUse,
        inputRange.bikeUse.value
    );
};

const personalScrapeOptions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        titleDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qTitle_cboAnswer',
        maritalStatus: '#ctl00_cphBody_qsProposerPersonalDetails_qMaritalStatus_cboAnswer',
        ukResidentFrom: {
            checkbox: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_chkCheckBox',
            month: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_tbMonth',
            year: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_tbYear'
        },
        employmentDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qFullTimeEmploymentStatus_cboAnswer',
        partTimeEmployment: {
            yes: '#ctl00_cphBody_qsProposerPersonalDetails_qPartTimeEmployment_rbAnswer1',
            no: '#ctl00_cphBody_qsProposerPersonalDetails_qPartTimeEmployment_rbAnswer2'
        },
        licenceType: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceType_cboAnswer',
        howLongLicence: {
            year: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerYears',
            month: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerMonths'
        }
    }

    // First column
    await page.select(
        selectors.titleDropdown,
        inputRange.title.value
    );

    await page.select(
        selectors.maritalStatus,
        inputRange.maritalStatus.value
    );

    const isSelected = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element.checked;
    }, selectors.ukResidentFrom.checkbox);

    if (inputRange.ukResidentFrom.birth && isSelected) {
        await page.click(selectors.ukResidentFrom.checkbox);
    } else if (!inputRange.ukResidentFrom.birth && !isSelected) {
        await page.click(selectors.ukResidentFrom.checkbox);
    }

    if (inputRange.ukResidentFrom.birth) {
        await utils.helpers.typeClean(
            page,
            selectors.ukResidentFrom.year,
            inputRange.ukResidentFrom.year
        );

        await utils.helpers.typeClean(
            page,
            selectors.ukResidentFrom.month,
            inputRange.ukResidentFrom.month
        );
    }

    // Second column
    await page.select(
        selectors.employmentDropdown,
        inputRange.fullTimeEmployment.value
    );

    if (inputRange.partTimeEmploymentLess16Hrs) {
        await page.click(selectors.partTimeEmployment.yes);
    } else {
        await page.click(selectors.partTimeEmployment.no);
    }

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    );

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    );


    await page.select(
        selectors.howLongLicence.year,
        inputRange.selectedLicenceLength.year.value
    );
    if (inputRange.selectedLicenceLength.year.text === 'Less than 1') {
        await page.select(
            selectors.howLongLicence.month,
            inputRange.selectedLicenceLength.month.value
        );
    }

    // option scrape
    const personalDetails = {
        title: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.titleDropdown)),
        maritalStatus: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.maritalStatus)),
        ukResidentFrom: {
            birth: [
                true,
                false
            ],
            month: {
                from: '1',
                to: '12'
            },
            year: {
                from: '1950',
                to: '2018'
            }
        },
        fullTimeEmployment: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.employmentDropdown)),
        partTimeEmploymentLess16Hrs: [
            true,
            false
        ],
        licenceType: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.licenceType)),
        selectedLicenceLength: {
            year: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.howLongLicence.year)),
            month: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.howLongLicence.month))
        }
    };

    return personalDetails;
};

const addressScrapeOptions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        postCode: '#ctl00_cphBody_qsAddressDetails_qPostcode_tbAnswer',
        findAddressButton: '#ctl00_cphBody_qsAddressDetails_btnAddressLookupButton_btnAddressLookup',
        addressDropdown: '#ctl00_cphBody_qsAddressDetails_qAddress_cboAnswer',
        mainPhone: '#ctl00_cphBody_qsAddressDetails_qDaytimeTel_tbAnswer',
        additionalPhone: '#ctl00_cphBody_qsAddressDetails_qEveningTel_tbAnswer',
        keptAtMainAdress: {
            yes: '#ctl00_cphBody_qsAddressDetails_qKeptOvernight_rbAnswer1',
            no: '#ctl00_cphBody_qsAddressDetails_qKeptOvernight_rbAnswer2'
        },
        overNightPostCode: '#ctl00_cphBody_qsAddressDetails_qOvernightPostcode_tbAnswer'
    }

    await utils.helpers.typeClean(
        page,
        selectors.postCode,
        inputRange.address.postCode.value
    )

    await page.click(selectors.findAddressButton);
    await utils.timing.loaded(page);

    const selectAddress = async (page, selector, inputRangeAddress) => {
        const findAddress = (addresses, address) => {
            const addressCleared = address.replace(/[^a-zA-Z0-9-\s]+/g, '');

            const addressParts = addressCleared.split(' ');
            const abbreviations = {
                Rd: 'Road',
                Ave: 'Avenue',
                Ln: 'Lane',
                Dr: 'Drive',
                St: 'Street'
            }

            const addressPartsFixed = addressParts.map(addressItem => {
                for (let key of Object.keys(abbreviations)) {
                    if (key === addressItem) {
                        return abbreviations[key];
                    }
                }
                
                return addressItem;
            });

            for (let address of addresses) {
                let match = [];

                for (let i = 0; i < addressPartsFixed.length; i++) {
                    const pattern = new RegExp(addressPartsFixed[i], 'i');

                    match[i] = pattern.test(address.text);
                }

                const matchedCount = match.filter(item => item === true).length;

                if (matchedCount === addressPartsFixed.length) {
                    return address;
                }
            }
        }

        const options = await utils.helpers.getOptions(page, selector);
        const address = findAddress(options, inputRangeAddress);

        await page.select(selector, address.value);
    }

    await selectAddress(page, selectors.addressDropdown, inputRange.address.address.value);

    await utils.helpers.typeClean(
        page,
        selectors.mainPhone,
        inputRange.mainPhone.value
    );

    if (inputRange.additionalPhone) {
        await utils.helpers.typeClean(
            page,
            selectors.additionalPhone,
            inputRange.additionalPhone.value
        );
    }
    
    if (inputRange.keptAtMainAddress) {
        await page.click(selectors.keptAtMainAdress.yes);
    } else {
        await page.click(selectors.keptAtMainAdress.no);

        await utils.helpers.typeClean(
            page,
            selectors.overNightPostCode,
            inputRange.overNightPostCode.value
        );
    }

    // option scrape
    const addressDetails = {
        address: [
            {
                postCode: {
                    example: 'SK4 2LZ',
                    value: ''
                },
                address: {
                    example: '285 Green Ln, Stockport',
                    value: ''
                }
            }
        ],
        overNightPostCode: {
            example: 'SK4 2LC',
            value: ['']
        },
        mainPhone: {
            example: '07954463999',
            value: ['']
        },
        additionalPhone: {
            example: '07954463991',
            value: ['']
        },
        keptAtMainAddress: [
            true,
            false
        ]
    };

    return addressDetails;
};

const bikeDetailsScrapeOptions = async (page, db, scrapeId, inputRange, scrapeFew = false, bikeScrapeCap = 2) => {
    const selectors = {
        knowRegNumber: {
            yes: '#ctl00_cphBody_qsVehicleSelection_qKnowRegNo_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleSelection_qKnowRegNo_rbAnswer2'
        },
        bikeMake: '#ctl00_cphBody_qsVehicleSelection_qVehicleMake_cboAnswer',
        manufactureYear: '#ctl00_cphBody_qsVehicleSelection_qYearOfMan_tbAnswer',
        engineSize: {
            isElectric: '#ctl00_cphBody_qsVehicleSelection_qEngineSizeCC_chkCheckBox',
            engineCC: '#ctl00_cphBody_qsVehicleSelection_qEngineSizeCC_tbAnswer'
        },
        findVehicleButton: '#ctl00_cphBody_qsVehicleSelection_btnVehicleLookupDontKnowRegButton_btnVehicleLookup',
        findVehicleLoadingDiv: '#ctl00_cphBody_qsVehicleSelection_btnVehicleLookupDontKnowRegButton_ucPleaseWait_divPleaseWait',
        vehicleDropdown: '#ctl00_cphBody_qsVehicleSelection_qConfirmVehicleDontKnowReg_cboAnswer'
    }

    let bikeDetailsOptions = {
        manufactureYear: {
            from: '1900',
            to: '2018'
        },
        knowRegNumber: [
            false
        ],
        engineSize: {
            isElectric: [
                true,
                false
            ],
            engineCC: {
                from: '1',
                to: '3000'
            }
        },
        bike: []
    };

    try {
        const cwd = require('cwd');
        const scrapeOptions = require(cwd('utils/presetscrapeoptions/quoteDetails_bikeDetails'));
        bikeDetailsOptions = {
            ...bikeDetailsOptions,
            ...scrapeOptions
        }
    } catch (err) {}

    const selectMake = async (page, selector, bikeMake) => {
        const options = await utils.helpers.getOptions(page, selector)

        let brand;
        const regex = (pattern) => new RegExp(`(${pattern})(?!.)`, 'i');
        
        for (let option of options) {
            if(regex(bikeMake).test(option.text)) {
                // workaround for RegExp 'lookbehind' non existance in Javascript
                const optionTextBackwards = option.text
                    .split('')
                    .reverse()
                    .join('');
                const bikeMakeBackwards = bikeMake
                    .split('')
                    .reverse()
                    .join('');

                if (regex(bikeMakeBackwards).test(optionTextBackwards)) {
                    brand = option;
                }
            }
        }

        await page.select(selector, brand.value);
    };

    const selectBike = async (page, selector, bike, manufactureYear) => {
        const options = await utils.helpers.getOptions(page, selector);

        let match;
        const pattern = new RegExp(bike, 'i');

        for (let option of options) {
            if (pattern.test(option.text)) {
                match = option;
                break;
            }
        }

        await page.select(selector, match.value);
    };

    const getManufacturers = async (page, selector) => {
        const manufacturersRaw = await utils.helpers.getOptions(page, selectors.bikeMake);

        return manufacturersRaw.filter((manufacturer, index) => {
            if (!index || !manufacturer.value) {
                return
            }

            return manufacturer;
        });
    };

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

    if (inputRange.knowRegNumber) {
        await page.click(selectors.knowRegNumber.yes);
    } else {
        await page.click(selectors.knowRegNumber.no);
    }

    const manufactureYearList = getNumberList(
        bikeDetailsOptions.manufactureYear.from,
        bikeDetailsOptions.manufactureYear.to
    );

    const engineCCList = getNumberList(
        bikeDetailsOptions.engineSize.engineCC.from,
        bikeDetailsOptions.engineSize.engineCC.to,
        20
    );

    const waitForBikesLoad = async () => {
        do {
            try {
                await page.waitFor(30); // to not bash CPU
                const shouldReturn = await page.evaluate(({ selector }) => {
                    const loadingDiv = document.querySelector(selector);

                    if (loadingDiv.style.display === 'none') {
                        return true;
                    }
                }, {
                    selector: selectors.findVehicleLoadingDiv
                })

                if (shouldReturn) {
                    return;
                }
            } catch (error) {
                await page.waitFor(30); // wait for if loading div is not available
                return;
            }
        } while (true);
    };

    const getBikes = async (
        page,
        {
            findVehicleButton,
            vehicleDropdown
        }
    ) => {
        await page.click(findVehicleButton);
        await utils.timing.loaded(page, 50);
        await waitForBikesLoad();

        const vehicleList = await utils.helpers.getOptions(
            page,
            vehicleDropdown
        );

        return vehicleList.filter((vehicle, index) => {
            if (!index) {
                return
            }

            return vehicle;
        });
    };

    const flatten = (messyList) => {
        const cleanList = [];

        for (let messyItem of messyList) {
            if (messyItem.length) {
                for (let item of messyItem) {
                    cleanList.push(item);
                }
            }
        }

        return cleanList;
    }

    bikeDetailsOptions.bikeMake = await getManufacturers(page, selectors.bikeMake);

    for (let makerIndex = 0; makerIndex < bikeDetailsOptions.bikeMake.length; makerIndex++) {
        let manufacturer = bikeDetailsOptions.bikeMake[makerIndex]
        let bikesTemp = [];

        await selectMake(page, selectors.bikeMake, manufacturer.text);

        for (let manufactureYear of manufactureYearList) {
            await utils.helpers.typeClean(
                page,
                selectors.manufactureYear,
                manufactureYear
            );

            for (let electric of bikeDetailsOptions.engineSize.isElectric) {
                const isSelected = await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    return element.checked;
                }, selectors.engineSize.isElectric);
            
                if (electric && !isSelected) {
                    await page.click(selectors.engineSize.isElectric);
                } else if (!electric && isSelected) {
                    await page.click(selectors.engineSize.isElectric);
                }

                if (electric) {
                    bikesTemp.push(await getBikes(
                        page,
                        {
                            vehicleDropdown: selectors.vehicleDropdown,
                            findVehicleButton: selectors.findVehicleButton
                        }
                    ));
                } else {
                    for (let engineCC of engineCCList) {
                        await utils.helpers.typeClean(
                            page,
                            selectors.engineSize.engineCC,
                            engineCC
                        );

                        bikesTemp.push(await getBikes(
                            page,
                            {
                                vehicleDropdown: selectors.vehicleDropdown,
                                findVehicleButton: selectors.findVehicleButton
                            }
                        ));
                    }
                }
            }
        }

        const bikesTempFlattened = flatten(bikesTemp);

        utils.helpers.removeArrayDuplicates(bikesTempFlattened)
            .map(bike => bikeDetailsOptions.bike.push(bike));

        if (bikeDetailsOptions.bikeMakerScrapeCap) {
            if ((bikeDetailsOptions.bikeMakerScrapeCap - 1) === makerIndex) {
                break
            }
        } else if (bikeDetailsOptions.bikeMakerScrapeCap === null) {
            continue;
        } else if (scrapeFew) {
            if (makerIndex === bikeScrapeCap) {
                break;
            }
        }
    }
   
    return bikeDetailsOptions;
};

const coverDetailsScrapeOptions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        coverType: '#ctl00_cphBody_qsCoverDetails_qTypeOfCover_cboAnswer',
        bikeNoClaims: '#ctl00_cphBody_qsCoverDetails_qNCB_cboAnswer',
        ridersCount: '#ctl00_cphBody_qsCoverDetails_qNoOfDrivers_cboAnswer',
        bikeUse: '#ctl00_cphBody_qsCoverDetails_qUseOfVehicle_cboAnswer'
    }

    // first column
    await page.select(
        selectors.coverType,
        inputRange.coverType.value
    );

    await page.select(
        selectors.bikeNoClaims,
        inputRange.bikeNoClaims.value
    );

    // second column
    await page.select(
        selectors.ridersCount,
        inputRange.ridersCount.value
    );

    await page.select(
        selectors.bikeUse,
        inputRange.bikeUse.value
    );

    const coverDetailsOptions = {
        coverType: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.coverType)),
        bikeNoClaims: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.bikeNoClaims)),
        ridersCount: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.ridersCount)),
        bikeUse: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.bikeUse))
    };

    return coverDetailsOptions;
};

const quoteDetails = async (page, db, dbInstance, scrapeId, continueToNext, scrapeOptions, inputRange, scrapeFewBikes) => {
    const selectors = {
        continueToNext: '#ctl00_btnNext'
    }

    if (scrapeOptions) {
        const quoteDetails = {
            personalDetails: await personalScrapeOptions(page, db, scrapeId, inputRange.quoteDetails.personalDetails),
            addressDetails: await addressScrapeOptions(page, db, scrapeId, inputRange.quoteDetails.addressDetails),
            bikeDetails: await bikeDetailsScrapeOptions(
                page,
                db,
                scrapeId,
                inputRange.quoteDetails.bikeDetails,
                scrapeFewBikes
            ),
            coverDetails: await coverDetailsScrapeOptions(page, db, scrapeId, inputRange.quoteDetails.coverDetails)
        };

        await bikeDetails(page, db, scrapeId, inputRange.quoteDetails.bikeDetails); // input required field to continue

        await db.saveToDb(
            dbInstance,
            {
                type: 'scrapeOptions',
                data: {
                    scrapeId,
                    name: 'quoteDetails',
                    options: quoteDetails
                }
            }
        );
    } else {
        await personal(page, db, scrapeId, inputRange.quoteDetails.personalDetails);
        await address(page, db, scrapeId, inputRange.quoteDetails.addressDetails);
        await bikeDetails(page, db, scrapeId, inputRange.quoteDetails.bikeDetails);
        await coverDetails(page, db, scrapeId, inputRange.quoteDetails.coverDetails);
    }

    if (continueToNext) {
        await page.click(selectors.continueToNext);
    }
};

module.exports = quoteDetails;
