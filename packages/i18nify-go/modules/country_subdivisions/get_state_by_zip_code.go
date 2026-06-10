package country_subdivisions

import "fmt"

// GetStateByZipCode returns the state name that contains the given zipcode.
//
// When countryCode is empty, all available countries are searched. The first
// match wins. Returns an error when the zipcode cannot be found.
func GetStateByZipCode(zipCode string, countryCode string) (string, error) {
	if zipCode == "" {
		return "", fmt.Errorf("zipCode is required")
	}

	var countriesToSearch []string
	if countryCode != "" {
		countriesToSearch = []string{countryCode}
	} else {
		codes, err := GetAvailableCountryCodes()
		if err != nil {
			return "", fmt.Errorf("failed to get available country codes: %w", err)
		}
		countriesToSearch = codes
	}

	for _, code := range countriesToSearch {
		subdivisions := GetCountrySubdivisions(code)
		for _, state := range subdivisions.States {
			for _, city := range state.Cities {
				for _, zc := range city.Zipcodes {
					if zc == zipCode {
						return state.Name, nil
					}
				}
			}
		}
	}

	return "", fmt.Errorf("zipCode %q not found in any supported country", zipCode)
}
