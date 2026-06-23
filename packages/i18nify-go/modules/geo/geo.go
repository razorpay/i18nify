// Package geo provides geographic and locale utility functions.
package geo

import (
	"fmt"

	addressData "github.com/razorpay/i18nify/i18nify-data/go/address"
	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

var cachedCountryMetadata *countryMetadata.CountryMetadataData
var cachedAddressData *addressData.AddressData

// init eagerly loads embedded data at startup; panics on failure so
// misconfigured builds fail fast rather than silently returning bad data.
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
