// CODE GENERATED. DO NOT EDIT.
package bankcodes

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
	dataCache map[string]*BankInfo
	cacheMutex sync.RWMutex
)

// GetBankInfo returns the bank information data for a specific country code.
func GetBankInfo(countryCode string) (*BankInfo, error) {
	// Initialize cache on first call
	dataOnce.Do(func() {
		dataCache = make(map[string]*BankInfo)
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
		return nil, fmt.Errorf("failed to read embedded bankcodes data for country %s: %w", countryCode, err)
	}

	var bankInfo BankInfo
	if err := json.Unmarshal(jsonBytes, &bankInfo); err != nil {
		return nil, fmt.Errorf("failed to parse embedded bankcodes data for country %s: %w", countryCode, err)
	}

	// Cache the result
	cacheMutex.Lock()
	dataCache[countryCode] = &bankInfo
	cacheMutex.Unlock()

	return &bankInfo, nil
}

