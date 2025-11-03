// CODE GENERATED. DO NOT EDIT.
package currency

import (
	"embed"
	"encoding/json"
	"sync"
)

//go:embed data/data.json
var dataFS embed.FS

// root mirrors the top-level JSON with currency_information key
type root struct {
	CurrencyInformation map[string]*CurrencyInfo `json:"currency_information"`
}

var (
	dataOnce sync.Once
	data     map[string]*CurrencyInfo
)

// GetData returns a map keyed by ISO 4217 code to CurrencyInfo.
func GetData() map[string]*CurrencyInfo {
	dataOnce.Do(func() {
		// Read data from embedded filesystem
		jsonBytes, err := dataFS.ReadFile("data/data.json")
		if err != nil {
			panic("failed to read embedded currency data: " + err.Error())
		}
		
		var r root
		if err := json.Unmarshal(jsonBytes, &r); err != nil {
			panic("failed to parse embedded currency data: " + err.Error())
		}
		data = r.CurrencyInformation
		if data == nil {
			data = map[string]*CurrencyInfo{}
		}
	})
	return data
}


