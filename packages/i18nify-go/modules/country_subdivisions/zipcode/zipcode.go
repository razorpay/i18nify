// Package zipcode manages lookup for all the details related to zipcode (city, state) for a country
package zipcode

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	"strings"
)

type ZipCodeDetails struct {
	Details []Details
}

type ZipCodeData struct {
	zipCodeToDetails map[string]ZipCodeDetails
	cityToZipCodes   map[string][]string
}
type Details struct {
	cityNames []string
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
func GetDetailsFromZipCode(zipCode string, countryCode string) []country_subdivisions.State {
	// Validate inputs
	if zipCode == "" || countryCode == "" {
		return nil
	}

	// Get zip code data and subdivisions
	zipCodeData := GetCountryZipCodeDetails(countryCode)
	subdivisions := country_subdivisions.GetCountrySubdivisions(countryCode)

	var states []country_subdivisions.State

	// Check if zipcode exists in the data
	zipDetails, exists := zipCodeData.zipCodeToDetails[zipCode]
	if !exists {
		return states
	}

	// Iterate through details for this zipcode
	for _, detail := range zipDetails.Details {
		stateCode := detail.stateCode
		// Check if state exists
		state, stateExists := subdivisions.States[stateCode]
		if !stateExists {
			continue
		}
		// Create a copy of the state to modify
		stateCopy := state
		stateCopy.Cities = map[string]country_subdivisions.City{}
		for _, cityName := range detail.cityNames {
			stateCopy.Cities[cityName] = state.Cities[cityName]
		}
		states = append(states, stateCopy)
	}

	return states
}

func filterCitiesByZipCode(state country_subdivisions.State, zipCode string) map[string]country_subdivisions.City {
	filteredCities := make(map[string]country_subdivisions.City)

	for cityName, city := range state.Cities {
		// Check if the city contains the specific zipcode
		for _, zip := range city.Zipcodes {
			if zip == zipCode {
				filteredCities[cityName] = city
				break
			}
		}
	}
	return filteredCities
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
	cityToZipCode := make(map[string][]string)
	zipCodeToDetails := make(map[string]ZipCodeDetails)

	for stateCode, state := range subdivisions.States {
		for _, city := range state.Cities {
			// Lowercase city name once
			cityKey := strings.ToLower(city.Name)
			cityToZipCode[cityKey] = city.Zipcodes

			for _, zipcode := range city.Zipcodes {
				details, exists := zipCodeToDetails[zipcode]
				if !exists {
					details = ZipCodeDetails{}
				}
				// Check if state already exists to avoid duplicates
				stateExists := false
				for _, existingDetail := range details.Details {
					if existingDetail.stateCode == stateCode {
						stateExists = true
						// Ensure unique city names
						existingDetail.cityNames = appendUnique(existingDetail.cityNames, city.Name)
						break
					}
				}
				if !stateExists {
					details.Details = append(details.Details, Details{
						stateCode: stateCode,
						cityNames: []string{city.Name},
					})
				}

				zipCodeToDetails[zipcode] = details
			}
		}
	}

	return ZipCodeData{
		cityToZipCodes:   cityToZipCode,
		zipCodeToDetails: zipCodeToDetails,
	}
}

// Helper function to append unique strings
func appendUnique(slice []string, item string) []string {
	for _, existing := range slice {
		if existing == item {
			return slice
		}
	}
	return append(slice, item)
}
