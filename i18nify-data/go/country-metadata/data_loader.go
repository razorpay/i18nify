// CODE GENERATED. DO NOT EDIT.
package country_metadata

import (
	"embed"
	"encoding/json"
	"sync"
)

//go:embed data/data.json
var dataFS embed.FS

// root mirrors the top-level JSON structure
type root struct {
	MetadataInformation map[string]*MetadataInformation `json:"metadata_information"`
}

var (
	dataOnce sync.Once
	data     map[string]*MetadataInformation
)

// GetData returns a map keyed by code to MetadataInformation.
func GetData() map[string]*MetadataInformation {
	dataOnce.Do(func() {
		// Read data from embedded filesystem
		jsonBytes, err := dataFS.ReadFile("data/data.json")
		if err != nil {
			panic("failed to read embedded country metadata data: " + err.Error())
		}
		
		var r root
		if err := json.Unmarshal(jsonBytes, &r); err != nil {
			panic("failed to parse embedded country metadata data: " + err.Error())
		}
		data = r.MetadataInformation
		if data == nil {
			data = map[string]*MetadataInformation{}
		}
	})
	return data
}


