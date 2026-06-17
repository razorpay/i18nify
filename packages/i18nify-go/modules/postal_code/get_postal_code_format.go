package postal_code

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
)

//go:embed data/postalCodeData.json
var rawPostalCodeData []byte

// PostalCodeFormat classifies the character composition of a postal code.
type PostalCodeFormat string

const (
	FormatNumeric      PostalCodeFormat = "numeric"
	FormatAlphanumeric PostalCodeFormat = "alphanumeric"
	FormatNone         PostalCodeFormat = "none"
)

// PostalCodeInfo describes the postal code system for a country.
type PostalCodeInfo struct {
	CountryName string           `json:"country_name"`
	Format      PostalCodeFormat `json:"format"`
	ZipRegex    string           `json:"zip_regex"`
	Examples    []string         `json:"examples"`
}

var (
	postalCodeOnce sync.Once
	postalCodeMap  map[string]PostalCodeInfo
	postalCodeErr  error
)

func loadPostalCodeData() (map[string]PostalCodeInfo, error) {
	postalCodeOnce.Do(func() {
		if err := json.Unmarshal(rawPostalCodeData, &postalCodeMap); err != nil {
			postalCodeErr = fmt.Errorf("postal_code: failed to parse postalCodeData.json: %w", err)
		}
	})
	return postalCodeMap, postalCodeErr
}

// GetPostalCodeFormat returns postal code information for the given ISO 3166-1
// alpha-2 country code.
func GetPostalCodeFormat(countryCode string) (PostalCodeInfo, error) {
	if strings.TrimSpace(countryCode) == "" {
		return PostalCodeInfo{}, fmt.Errorf("postal_code: GetPostalCodeFormat: countryCode must be a non-empty string")
	}
	cc := strings.ToUpper(strings.TrimSpace(countryCode))
	m, err := loadPostalCodeData()
	if err != nil {
		return PostalCodeInfo{}, err
	}
	info, ok := m[cc]
	if !ok {
		return PostalCodeInfo{}, fmt.Errorf(
			"postal_code: GetPostalCodeFormat: no postal code data for %q — pass a valid ISO 3166-1 alpha-2 code", cc,
		)
	}
	return info, nil
}
