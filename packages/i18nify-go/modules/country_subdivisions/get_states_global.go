package country_subdivisions

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions"
)

// SubdivisionInfo is a single first-level administrative division
// with its ISO 3166-2 code (e.g. "US-CA") and English name.
type SubdivisionInfo struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

// CountrySubdivisionData holds the country name and all of its first-level
// administrative divisions (states, provinces, regions, etc.).
type CountrySubdivisionData struct {
	CountryName  string            `json:"country_name"`
	Subdivisions []SubdivisionInfo `json:"subdivisions"`
}

type statesGlobalEnvelope struct {
	StatesByCountry map[string]CountrySubdivisionData `json:"states_by_country"`
}

var (
	statesGlobalOnce sync.Once
	statesGlobalMap  map[string]CountrySubdivisionData
	statesGlobalErr  error
)

func loadStatesGlobal() (map[string]CountrySubdivisionData, error) {
	statesGlobalOnce.Do(func() {
		var env statesGlobalEnvelope
		if err := json.Unmarshal(dataSource.GetStatesGlobalJSON(), &env); err != nil {
			statesGlobalErr = fmt.Errorf("country_subdivisions: failed to parse states_global.json: %w", err)
			return
		}
		statesGlobalMap = env.StatesByCountry
	})
	return statesGlobalMap, statesGlobalErr
}

// GetStatesByCountry returns the country name and list of first-level
// administrative divisions for the given ISO 3166-1 alpha-2 country code.
//
// Example:
//
//	data, err := GetStatesByCountry("US")
//	fmt.Println(data.CountryName)         // "United States of America (the)"
//	fmt.Println(data.Subdivisions[0].Code) // "US-AK"
//	fmt.Println(data.Subdivisions[0].Name) // "Alaska"
func GetStatesByCountry(countryCode string) (CountrySubdivisionData, error) {
	if strings.TrimSpace(countryCode) == "" {
		return CountrySubdivisionData{}, fmt.Errorf(
			"country_subdivisions: GetStatesByCountry: countryCode must not be empty",
		)
	}
	cc := strings.ToUpper(strings.TrimSpace(countryCode))

	m, err := loadStatesGlobal()
	if err != nil {
		return CountrySubdivisionData{}, err
	}

	data, ok := m[cc]
	if !ok {
		return CountrySubdivisionData{}, fmt.Errorf(
			"country_subdivisions: GetStatesByCountry: no subdivision data for %q — pass a valid ISO 3166-1 alpha-2 code",
			cc,
		)
	}
	return data, nil
}

// GetStatesByCountriesMap returns the complete map of ISO 3166-1 alpha-2
// country codes to their subdivision data (country name + subdivisions list).
//
// The map covers 228 countries sourced from GeoNames admin1CodesASCII.
// Subdivision codes follow ISO 3166-2 format (e.g. "US-CA", "IN-16", "DE-02").
func GetStatesByCountriesMap() (map[string]CountrySubdivisionData, error) {
	return loadStatesGlobal()
}
