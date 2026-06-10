// Package postalcode provides postal code format information per country.
// Data source: UPU / Google i18n Address Data (chromium-i18n.appspot.com/ssl-address).
package postalcode

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
)

//go:embed data/data.json
var rawData []byte

// PostalCodeFormat is the classification of a country's postal code.
type PostalCodeFormat string

const (
	// FormatNumeric indicates the postal code contains only digits.
	FormatNumeric PostalCodeFormat = "numeric"
	// FormatAlphanumeric indicates the postal code contains letters and/or digits.
	FormatAlphanumeric PostalCodeFormat = "alphanumeric"
	// FormatNone indicates the country does not use postal codes.
	FormatNone PostalCodeFormat = "none"
)

// PostalCodeInfo holds postal code metadata for a country.
type PostalCodeInfo struct {
	CountryName string           `json:"country_name"`
	Format      PostalCodeFormat `json:"format"`
	ZipRegex    string           `json:"zip_regex"`
	Examples    []string         `json:"examples"`
}

type dataFile struct {
	PostalCodeFormatInformation map[string]PostalCodeInfo `json:"postal_code_format_information"`
}

var (
	cache     map[string]PostalCodeInfo
	cacheOnce sync.Once
	cacheErr  error
)

func loadData() (map[string]PostalCodeInfo, error) {
	cacheOnce.Do(func() {
		var f dataFile
		if err := json.Unmarshal(rawData, &f); err != nil {
			cacheErr = fmt.Errorf("postalcode: failed to parse embedded data: %w", err)
			return
		}
		cache = f.PostalCodeFormatInformation
	})
	return cache, cacheErr
}

// GetPostalCodeFormat returns postal code metadata for the given ISO 3166-1 alpha-2 country code.
// The country code is case-insensitive.
//
// Returns an error if the country code is empty or not found in the dataset.
func GetPostalCodeFormat(countryCode string) (PostalCodeInfo, error) {
	if strings.TrimSpace(countryCode) == "" {
		return PostalCodeInfo{}, fmt.Errorf("postalcode: countryCode must not be empty")
	}
	cc := strings.ToUpper(strings.TrimSpace(countryCode))

	data, err := loadData()
	if err != nil {
		return PostalCodeInfo{}, err
	}

	info, ok := data[cc]
	if !ok {
		return PostalCodeInfo{}, fmt.Errorf("postalcode: no data found for country code %q", cc)
	}
	return info, nil
}
