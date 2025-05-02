// Package i18nify_go provides functionality for internationalization and localization in Go.
package i18nify_go

import (
	metadata "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	subdivisions "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions/zipcode"
	currency "github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
	phonenumber "github.com/razorpay/i18nify/packages/i18nify-go/modules/phonenumber"
)

// Country represents a country with its code.
type Country struct {
	Code string // Code represents the ISO 3166-1 alpha-2 country code.
}

// GetCountryMetadata retrieves metadata information for the country.
func (c *Country) GetCountryMetadata() metadata.MetadataInformation {
	return metadata.GetMetadataInformation(c.Code)
}

// GetCountryPhoneNumber retrieves telephone number information for the country.
func (c *Country) GetCountryPhoneNumber() phonenumber.CountryTeleInformation {
	return phonenumber.GetCountryTeleInformation(c.Code)
}

// GetCountrySubDivisions retrieves subdivision information for the country.
func (c *Country) GetCountrySubDivisions() subdivisions.CountrySubdivisions {
	return subdivisions.GetCountrySubdivisions(c.Code)
}

// GetCountryCurrency retrieves currency information for the country.
func (c *Country) GetCountryCurrency() []currency.CurrencyInformation {
	// Retrieve metadata information for the country.
	countryMetadata := c.GetCountryMetadata()

	var curInfoList []currency.CurrencyInformation
	// Iterate through currency codes for the country.
	for _, cur := range countryMetadata.SupportedCurrency {
		// Retrieve currency information for each currency code.
		curr, err := currency.GetCurrencyInformation(cur)
		if err == nil {
			curInfoList = append(curInfoList, curr)
		}
	}
	return curInfoList
}

// GetStatesByZipCode retrieves the states with zipcode for the country.
func (c *Country) GetStatesByZipCode(zipCode string) []subdivisions.State {
	return zipcode.GetDetailsFromZipCode(zipCode, c.Code)
}

// IsValidZipCode returns whether a zipCode is valid for the country or not.
func (c *Country) IsValidZipCode(zipCode string) bool {
	return zipcode.IsValidZipCode(zipCode, c.Code)
}

// GetZipCodesFromCity returns all the zipcodes belonging to that city.
func (c *Country) GetZipCodesFromCity(cityName string) []string {
	return zipcode.GetZipCodesFromCity(cityName, c.Code)
}

// GetCountryCodeISO2 returns the ISO 3166-1 alpha-2 country code for a given country name.
func (c *Country) GetCountryCodeISO2() string {
	return metadata.GetCountryCodeISO2(c.Code)
}

// NewCountry creates a new Country instance with the given country code.
func NewCountry(code string) ICountry {
	return &Country{
		Code: code,
	}
}
