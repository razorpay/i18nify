package geo

import "fmt"

// GetDefaultLocaleList returns a map of ISO 3166-1 alpha-2 country codes to
// their default BCP 47 locale tag (e.g., "IN" → "en_IN").
//
// Countries whose metadata has no default_locale set are silently skipped.
// The result is derived from the cached country metadata and is safe to call
// from multiple goroutines.
//
// It mirrors the JavaScript getDefaultLocaleList function in the i18nify-js
// geo module.
//
// Example:
//
//	locales, err := GetDefaultLocaleList()
//	// → { "IN": "en_IN", "US": "en_US", "DE": "de", ... }
func GetDefaultLocaleList() (map[string]string, error) {
	if cachedCountryMetadata == nil {
		return nil, fmt.Errorf("getDefaultLocaleList: country metadata not loaded")
	}

	metadataMap := cachedCountryMetadata.GetMetadataInformation()
	result := make(map[string]string, len(metadataMap))
	for code, info := range metadataMap {
		if info != nil && info.GetDefaultLocale() != "" {
			result[code] = info.GetDefaultLocale()
		}
	}

	if len(result) == 0 {
		return nil, fmt.Errorf("getDefaultLocaleList: no default locales found in metadata")
	}

	return result, nil
}
