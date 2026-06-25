package country_subdivisions

import _ "embed"

//go:embed states_global.json
var StatesGlobalJSON []byte

// GetStatesGlobalJSON returns the raw bytes of states_global.json embedded in
// this data module. The caller is responsible for unmarshalling.
func GetStatesGlobalJSON() []byte {
	return StatesGlobalJSON
}
