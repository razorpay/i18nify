// Package geo provides geographic and locale utility functions.
// It is the Go equivalent of the i18nify-js geo module and exposes:
//
//   - GetDefaultLocaleList  — map of country codes to default BCP 47 locale tags
//   - FormatAddressWithFormat — format address components using country-specific templates
package geo

import (
	"fmt"

	addressData "github.com/razorpay/i18nify/i18nify-data/go/address"
	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

var cachedCountryMetadata *countryMetadata.CountryMetadataData
var cachedAddressData *addressData.AddressData

// init loads both data packages once at package startup.
// Panics on failure — matching the convention used by all other i18nify-go service modules.
func init() {
	cm, err := countryMetadata.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("geo: failed to load country metadata: %v", err))
	}
	cachedCountryMetadata = cm

	ad, err := addressData.GetAddressData()
	if err != nil {
		panic(fmt.Sprintf("geo: failed to load address data: %v", err))
	}
	cachedAddressData = ad
}
