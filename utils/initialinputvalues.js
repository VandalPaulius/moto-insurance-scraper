const initialInputValues = {
    quoteDetails: {
        personalDetails: {
            title: {
                text: 'Mr',
                value: '1'
            },
            maritalStatus: {
                text: 'Single',
                value: '7'
            },
            ukResidentFrom: {
                birth: false,
                month: '7',
                year: '2017'
            },
            fullTimeEmployment: {
                text: 'Employed',
                value: '27'
            },
            partTimeEmploymentLess16Hrs: false,
            licenceType: {
                text: 'EU Full Bike',
                value: '385'
            },
            selectedLicenceLength: {
                year: {
                    text: 'Less than 1',
                    value: '1137'
                },
                month: {
                    text: '11',
                    value: '1149'
                }
            }
        },
        addressDetails: {
            address: {
                address: {
                    value: '285 Green Ln, Stockport',
                    example: '285 Green Ln, Stockport'
                },
                postCode: {
                    value: 'SK4 2LZ',
                    example: 'SK4 2LZ'
                }
            },
            overNightPostCode: {
                value: 'SK4 2LZ',
                example: 'SK4 2LZ'
            },
            mainPhone: {
                value: '07954463999',
                example: '07954463999'
            },
            additionalPhone: {
                value: '',
                example: '07954463991'
            },
            keptAtMainAddress: true
        },
        bikeDetails: {
            knowRegNumber: false,
            bikeMake: {
                value: 'Honda'
            },
            manufactureYear: '2014',
            engineSize: {
                isElectric: false,
                engineCC: '125'
            },
            bike: {
                text: 'HONDA CBF 125, 2008 onwards, 124cc, Manual, Petrol, Dual-Purpose' // as in the list
            }
        },
        coverDetails: {
            coverType: {
                value: '108',
                text: 'Third Party Fire & Theft'
            },
            bikeNoClaims: {
                value: '109',
                text: 'None'
            },
            ridersCount: {
                value: '234',
                text: 'Proposer only'
            },
            bikeUse: {
                value: '228',
                text: 'Social including commuting to a single place of work'
            }
        }
    },
    riderDetails: {
        claimsAndConvictions: {
            claimsAccidents5Years: false,
            motorConvictions: false
        },
        ridingHistory: {
            ridingQualifications: {
                value: '140',
                text: 'None'
            },
            bikeOrganisation: {
                value: '402',
                text: 'None'
            },
            carLicence: {
                value: '126',
                text: 'EU full'
            },
            carLicenceLength: {
                year: {
                    value: '1137',
                    text: 'Less than 1'
                },
                month: {
                    value: '1144',
                    text: '6'
                }
            },
            haveCar: {
                value: '957',
                text: 'No'
            },
            cbtPassed: {
                passed: true,
                year: '2016',
                month: '7'
            },
            riddenBikeLastYear: {
                ridden: true,
                engineCC: '660',
                yearsRiding: {
                    value: '0',
                    text: '0 (Less than a year)'
                }
            }
        },
        generalDetails: {
            medicalConditions: {
                text: 'No',
                value: '143'
            },
            totalBikesOwned: '1',
            otherVehicles: {
                value: '150',
                text: 'No access to any other vehicles'
            },
            nonMotorCriminalConvictions: false,
            homeOwner: false,
            childrenUnder16: false
        },
        occupationDetails: {
            occupation: {
                text: 'Aircraft Engineer',
                value: '40'
            },
            business: {
                text: 'Aerial Photography',
                value: '10'
            }
        }
    },
    bikeDetails: {
        bikeInfo: {
            purchaseDate: {
                alreadyBought: true,
                year: '2017',
                month: '7'
            },
            sideCar: false,
            includePillion: true,
            usedToTow: false,
            previouslyInsured: false,
            modified: false,
            bikeValue: '1400',
            bikeOvernightParking: {
                text: 'On the road at home',
                value: '339'
            },
            bikeImported: {
                text: 'No',
                value: '849'
            },
            registeredKeeper: {
                text: 'Proposer',
                value: '319'
            },
            legalOwner: {
                text: 'Proposer',
                value: '319'
            }
        },
        bikeSecurity: {
            alarmImmobilizer: 'Abletronics A2000 plus',
            mechanicalSecurity: 'Almax Immobiliser Series IV Padlock And Chain',
            secureMarkings: {
                text: 'Datatag',
                value: '519'
            },
            tracker: {
                text: '(Not in list)',
                value: '1492'
            }
        }
    },
    coverDetails: {
        coverInfo: {
            plusDays: '15',
            renewalPrice: '0',
            voluntaryExcess: {
                text: '£250',
                value: '121'
            },
            annualMileage: {
                value: '204',
                text: 'Up to 6000'
            },
            payFull: false,
            declinedOrSpecialTerms: false
        }
    }
}

module.exports.initialInputValues = initialInputValues;
