// CODE GENERATED. DO NOT EDIT.
package country_subdivisions

import (
	"embed"
	"encoding/json"
	"fmt"
	"path/filepath"
	"sync"
)

//go:embed data
var dataFS embed.FS

var (
	dataOnce sync.Once
	dataCache map[string]*CountrySubdivisions
	cacheMutex sync.RWMutex
)

// GetCountrySubdivisions returns the subdivisions data for a specific country code.
func GetCountrySubdivisions(countryCode string) (*CountrySubdivisions, error) {
	// Initialize cache on first call
	dataOnce.Do(func() {
		dataCache = make(map[string]*CountrySubdivisions)
	})

	// Check cache first
	cacheMutex.RLock()
	if cached, exists := dataCache[countryCode]; exists {
		cacheMutex.RUnlock()
		return cached, nil
	}
	cacheMutex.RUnlock()

	// Load from embedded filesystem
	filePath := filepath.Join("data", countryCode+".json")
	jsonBytes, err := dataFS.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read embedded country subdivisions data for country %s: %w", countryCode, err)
	}

	var subdivisions CountrySubdivisions
	if err := json.Unmarshal(jsonBytes, &subdivisions); err != nil {
		return nil, fmt.Errorf("failed to parse embedded country subdivisions data for country %s: %w", countryCode, err)
	}

	// Cache the result
	cacheMutex.Lock()
	dataCache[countryCode] = &subdivisions
	cacheMutex.Unlock()

	return &subdivisions, nil
}

