package i18nify_go

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
)

// GetCountriesByCodes returns metadata (paired with the ISO 3166-1 alpha-2 code)
// for the given country codes, sorted by country name for deterministic
// dropdown rendering. When codes is empty or nil, every known country is
// returned. Unknown codes produce an error naming them rather than being
// silently dropped.
//
// This is a package-level function rather than a method on Country because it is
// inherently multi-country and therefore does not belong on ICountry.
func GetCountriesByCodes(codes []string) ([]country_metadata.CountryInfo, error) {
	return country_metadata.GetCountriesByCodes(codes)
}
