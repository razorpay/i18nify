// Package zipcode manages lookup for all the details related to zipcode (city, state) for a country
package zipcode

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
)

type PinCodeDetails struct {
	Cities     []country_subdivisions.City
	StateCodes []string
}

type PinCodeData struct {
	pinCodeToDetails map[string]PinCodeDetails
	cityToPinCodes   map[string][]string
}

var zipCodeStore = make(map[string]*PinCodeData)

func GetCountryZipCodeDetails(code string) *PinCodeData {
	if _, exists := zipCodeStore[code]; !exists {
		subdivision := country_subdivisions.GetCountrySubdivisions(code)
		pinCodeData := initializeZipCodeMap(subdivision)
		zipCodeStore[code] = pinCodeData
	}
	return zipCodeStore[code]
}
func GetStatesFromZipCode(zipCode string, countryCode string) []country_subdivisions.State {
	pinCodeData := GetCountryZipCodeDetails(countryCode)
	subdivisions := country_subdivisions.GetCountrySubdivisions(countryCode)
	var states []country_subdivisions.State
	for _, stateCode := range pinCodeData.pinCodeToDetails[zipCode].StateCodes {
		if state, exists := subdivisions.GetStateByStateCode(stateCode); exists {
			states = append(states, state)
		}
	}
	return states
}
func GetCitiesFromZipCode(zipCode string, countryCode string) []country_subdivisions.City {
	pinCodeData := GetCountryZipCodeDetails(countryCode)
	return pinCodeData.pinCodeToDetails[zipCode].Cities
}
func IsValidPinCode(zipCode string, countryCode string) bool {
	pinCodeData := GetCountryZipCodeDetails(countryCode)
	return len(pinCodeData.pinCodeToDetails[zipCode].StateCodes) > 0
}
func GetPinCodesFromCity(city string, countryCode string) []string {
	pinCodeData := GetCountryZipCodeDetails(countryCode)
	return pinCodeData.cityToPinCodes[city]
}

// initializeZipCodeMap builds the zip code maps for the given CountrySubdivisions.
func initializeZipCodeMap(subdivisions country_subdivisions.CountrySubdivisions) *PinCodeData {
	var cityToZipCode = make(map[string][]string)
	var details = make(map[string]PinCodeDetails)

	// Iterate through all states and cities to populate the zip code maps.
	for stateCode, state := range subdivisions.States {
		for _, city := range state.Cities {
			for _, zipcode := range city.Zipcodes {
				// check if an entry with specific PinCode already exists, if not create one
				if _, exists := details[zipcode]; !exists {
					details[zipcode] = PinCodeDetails{
						StateCodes: []string{},
						Cities:     []country_subdivisions.City{},
					}
				}
				pinCodeDetail := details[zipcode]
				pinCodeDetail.StateCodes = append(pinCodeDetail.StateCodes, stateCode)
				pinCodeDetail.Cities = append(pinCodeDetail.Cities, city)
				details[zipcode] = pinCodeDetail
			}
			cityToZipCode[city.Name] = city.Zipcodes
		}
	}
	return &PinCodeData{
		cityToPinCodes:   cityToZipCode,
		pinCodeToDetails: details,
	}
}
