// Package zipcode manages lookup for all the details related to zipcode (city, state) for a country
package zipcode

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	"strings"
)

type ZipCodeDetails struct {
	Cities     []CityDetails
	StateCodes []string
}

type ZipCodeData struct {
	zipCodeToDetails map[string]ZipCodeDetails
	cityToZipCodes   map[string][]string
}
type CityDetails struct {
	cityName  string
	stateCode string
}

var zipCodeStore = make(map[string]ZipCodeData)

func GetCountryZipCodeDetails(countryCode string) ZipCodeData {
	if _, exists := zipCodeStore[countryCode]; !exists {
		subdivision := country_subdivisions.GetCountrySubdivisions(countryCode)
		zipCodeData := initializeZipCodeMap(subdivision)
		zipCodeStore[countryCode] = zipCodeData
	}
	return zipCodeStore[countryCode]
}
func GetStatesFromZipCode(zipCode string, countryCode string) []country_subdivisions.State {
	zipCodeData := GetCountryZipCodeDetails(countryCode)
	subdivisions := country_subdivisions.GetCountrySubdivisions(countryCode)
	var states []country_subdivisions.State
	if _, exists := zipCodeData.zipCodeToDetails[zipCode]; !exists {
		return states
	}
	for _, stateCode := range zipCodeData.zipCodeToDetails[zipCode].StateCodes {
		if state, exists := subdivisions.GetStateByStateCode(stateCode); exists {
			states = append(states, state)
		}
	}
	return states
}
func GetCitiesFromZipCode(zipCode string, countryCode string) []country_subdivisions.City {
	zipCodeData := GetCountryZipCodeDetails(countryCode)
	subdivision := country_subdivisions.GetCountrySubdivisions(countryCode)
	var cities []country_subdivisions.City
	if _, exists := zipCodeData.zipCodeToDetails[zipCode]; !exists {
		return cities
	}
	for _, cityDetails := range zipCodeData.zipCodeToDetails[zipCode].Cities {
		if city, exists := subdivision.GetCityDetailsByCityName(cityDetails.cityName, cityDetails.stateCode); exists {
			cities = append(cities, city)
		}
	}
	return cities
}
func IsValidZipCode(zipCode string, countryCode string) bool {
	zipCodeData := GetCountryZipCodeDetails(countryCode)
	_, exists := zipCodeData.zipCodeToDetails[zipCode]
	return exists
}
func GetZipCodesFromCity(city string, countryCode string) []string {
	zipCodeData := GetCountryZipCodeDetails(countryCode)
	return zipCodeData.cityToZipCodes[strings.ToLower(city)]
}

// initializeZipCodeMap builds the zip code maps for the given CountrySubdivisions.
func initializeZipCodeMap(subdivisions country_subdivisions.CountrySubdivisions) ZipCodeData {
	var cityToZipCode = make(map[string][]string)
	var details = make(map[string]ZipCodeDetails)

	// Iterate through all states and cities to populate the zip code maps.
	for stateCode, state := range subdivisions.States {
		for _, city := range state.Cities {
			for _, zipcode := range city.Zipcodes {
				// check if an entry with specific ZipCode already exists, if not create one
				if _, exists := details[zipcode]; !exists {
					details[zipcode] = ZipCodeDetails{
						StateCodes: []string{},
						Cities:     []CityDetails{},
					}
				}
				zipCodeDetail := details[zipcode]
				zipCodeDetail.StateCodes = append(zipCodeDetail.StateCodes, stateCode)
				zipCodeDetail.Cities = append(zipCodeDetail.Cities, CityDetails{
					cityName:  city.Name,
					stateCode: stateCode,
				})
				details[zipcode] = zipCodeDetail
			}
			cityToZipCode[strings.ToLower(city.Name)] = city.Zipcodes
		}
	}
	return ZipCodeData{
		cityToZipCodes:   cityToZipCode,
		zipCodeToDetails: details,
	}
}
