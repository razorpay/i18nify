// CODE GENERATED. DO NOT EDIT.
package currency

import (
	"embed"
	"encoding/json"
)

//go:embed data/data.json
var dataFS embed.FS

// root mirrors the top-level JSON structure
type root struct {
	CurrencyInfo map[string]*CurrencyInfo `json:"currency_information"`
}

var data map[string]*CurrencyInfo

func init() {
		// Read data from embedded filesystem
		jsonBytes, err := dataFS.ReadFile("data/data.json")
		if err != nil {
			panic("failed to read embedded currency data: " + err.Error())
		}
		
		var r root
		if err := json.Unmarshal(jsonBytes, &r); err != nil {
			panic("failed to parse embedded currency data: " + err.Error())
		}
		data = r.CurrencyInfo
		if data == nil {
			data = map[string]*CurrencyInfo{}
		}
}

// GetData returns a map keyed by code to CurrencyInfo.
func GetData() map[string]*CurrencyInfo {
	return data
}


