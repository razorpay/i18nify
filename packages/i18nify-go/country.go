// Package i18nify_go provides functionality for internationalization and localization in Go.
package i18nify_go

import (
	metadata "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	subdivisions "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	currency "github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
	phonenumber "github.com/razorpay/i18nify/packages/i18nify-go/modules/phonenumber"
)

// Country represents a country with its code.
type Country struct {
	Code string // Code represents the ISO 3166-1 alpha-2 country code.
}

// GetCountryMetadata retrieves metadata information for the country.
func (c Country) GetCountryMetadata() metadata.MetadataInformation {
	return metadata.GetMetadataInformation(c.Code)
}

// GetCountryPhoneNumber retrieves telephone number information for the country.
func (c Country) GetCountryPhoneNumber() phonenumber.CountryTeleInformation {
	return phonenumber.GetCountryTeleInformation(c.Code)
}

// GetCountrySubDivisions retrieves subdivision information for the country.
func (c Country) GetCountrySubDivisions() subdivisions.CountrySubdivisions {
	return subdivisions.GetCountrySubdivisions(c.Code)
}

// GetCountryCurrency retrieves currency information for the country.
func (c Country) GetCountryCurrency() []currency.CurrencyInformation {
	// Retrieve metadata information for the country.
	countryMetadata := c.GetCountryMetadata()

	var curInfoList []currency.CurrencyInformation
	// Iterate through currency codes for the country.
	for _, cur := range countryMetadata.SupportedCurrency {
		// Retrieve currency information for each currency code.
		curInfoList = append(curInfoList, currency.GetCurrencyInformation(cur))
	}
	return curInfoList
}

// GetStatesByZipCode retrieves the states with zipcode for the country.
func (c Country) GetStatesByZipCode(zipcode string) []subdivisions.State {
	subdivision := subdivisions.GetCountrySubdivisions(c.Code)
	return subdivision.GetStatesByZipCode(zipcode)
}

// GetCitiesByZipCode retrieves the cities with zipcode for the country.
func (c Country) GetCitiesByZipCode(zipcode string) []subdivisions.City {
	// Get the subdivision
	subdivision := subdivisions.GetCountrySubdivisions(c.Code)
	// Get list of all the states which have zipCode included.
	states := subdivision.GetStatesByZipCode(zipcode)
	var cities []subdivisions.City
	// Get all cities with the zipCode from all the states.
	for _, state := range states {
		// Retrieve Cities with the zipCode from the state.
		cities = append(cities, state.GetCitiesByZipCode(zipcode)...)
	}
	return cities
}

// IsValidZipCode returns whether a pinCode is valid for the country or not.
func (c Country) IsValidZipCode(zipcode string) bool {
	return len(c.GetStatesByZipCode(zipcode)) > 0
}

// NewCountry creates a new Country instance with the given country code.
func NewCountry(code string) ICountry {
	return Country{
		Code: code,
	}
}
