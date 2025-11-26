// CODE GENERATED. DO NOT EDIT.
package currency

import (
	_ "embed"
	"encoding/json"
	"sync"
)

//go:embed data.json
var dataJSON []byte

// root mirrors the top-level JSON structure
type root struct {
	CurrencyInformation map[string]*CurrencyInfo `json:"currency_information"`
}

var (
	dataOnce sync.Once
	data     map[string]*CurrencyInfo
)

// GetData returns a map keyed by code to CurrencyInfo.
func GetData() map[string]*CurrencyInfo {
	dataOnce.Do(func() {
		// Parse embedded JSON data
		jsonBytes := dataJSON
		if len(jsonBytes) == 0 {
			panic("embedded currency data is empty")
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


