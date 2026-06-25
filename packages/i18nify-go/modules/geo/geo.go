// Package geo provides geographic and locale utility functions.
package geo

import (
	"fmt"

	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

// Package-level caches populated once by init below.
// Stored globally so every function call avoids reloading the embedded JSON files.
var cachedCountryMetadata *countryMetadata.CountryMetadataData

// init eagerly loads embedded data at startup; panics on failure so
// misconfigured builds fail fast rather than silently returning bad data.
func init() {
	cm, err := countryMetadata.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("geo: failed to load country metadata: %v", err))
	}
	cachedCountryMetadata = cm
}
