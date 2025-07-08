// Package i18nify_go provides utilities for internationalization and localization in Go.
package i18nify_go

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/phonenumber"
)

// ICountry defines an interface representing a country with various information retrieval methods.
type ICountry interface {
	// GetCountryMetadata retrieves metadata information for the country.
	GetCountryMetadata() country_metadata.MetadataInformation
	// GetCountrySubDivisions retrieves subdivision information for the country.
	GetCountrySubDivisions() country_subdivisions.CountrySubdivisions
	// GetCountryPhoneNumber retrieves telephone number information for the country.
	GetCountryPhoneNumber() phonenumber.CountryTeleInformation
	// GetCountryCurrency retrieves currency information for the country.
	GetCountryCurrency() []currency.CurrencyInformation
	// GetStatesByZipCode retrieves the states with zipcode for the country.
	GetStatesByZipCode(zipcode string) []country_subdivisions.State
	// IsValidZipCode returns whether a pinCode is valid for the country or not.
	IsValidZipCode(zipcode string) bool
	// GetZipCodesFromCity returns all the zipcodes belonging to that city.
	GetZipCodesFromCity(cityName string) []string
	// GetCountryCodeISO2 returns the ISO 3166-1 alpha-2 country code for a given country name.
	GetCountryCodeISO2() string
	// GetSwiftCodeFromBankShortCode returns the swift code for a given bank name.
	GetSwiftCodeFromBankShortCode(bankShortCode string) (string, error)
	// GetBankInfo returns the bank information for the country.
	GetBanksInfo() (map[string]interface{}, error)
}

type IBank interface {
	GetBankInfo() (map[string]interface{}, error)
	GetBankShortCodeFromBankName(bankName string) (string, error)
}
