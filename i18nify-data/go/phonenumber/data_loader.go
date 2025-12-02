// CODE GENERATED. DO NOT EDIT.
package phonenumber

import (
	"embed"
	"encoding/json"
	"sync"
)

//go:embed data/data.json
var dataFS embed.FS

// root mirrors the top-level JSON structure
type root struct {
	CountryTeleInformation map[string]*CountryTeleInformation `json:"country_tele_information"`
}

var (
	dataOnce sync.Once
	data     map[string]*CountryTeleInformation
)

// GetData returns a map keyed by code to CountryTeleInformation.
func GetData() map[string]*CountryTeleInformation {
	dataOnce.Do(func() {
		// Read data from embedded filesystem
		jsonBytes, err := dataFS.ReadFile("data/data.json")
		if err != nil {
			panic("failed to read embedded phone-number data: " + err.Error())
		}
		
		var r root
		if err := json.Unmarshal(jsonBytes, &r); err != nil {
			panic("failed to parse embedded phone-number data: " + err.Error())
		}
		data = r.CountryTeleInformation
		if data == nil {
			data = map[string]*CountryTeleInformation{}
		}
	})
	return data
}


