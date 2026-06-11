// Package geo provides geographic and locale utility functions.
package geo

import (
	"fmt"

	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

var cachedCountryMetadata *countryMetadata.CountryMetadataData

// init loads country metadata once at package startup.
func init() {
	cm, err := countryMetadata.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("geo: failed to load country metadata: %v", err))
	}
	cachedCountryMetadata = cm
}
