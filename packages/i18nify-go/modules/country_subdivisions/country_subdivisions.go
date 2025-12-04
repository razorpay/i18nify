// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countrySubdivisions, err := UnmarshalCountrySubdivisions(bytes)
//    bytes, err = countrySubdivisions.Marshal()

// Package country_subdivisions provides functionality to manage subdivisions (such as states, provinces, or regions) and cities within countries.
package country_subdivisions

import (
	"encoding/json"
	"fmt"
	"sync"

	external "github.com/razorpay/i18nify/i18nify-data/go/country-subdivisions"
)

// Cache to avoid duplicate reads for same countryCode
var (
	countrySubDivisionStore = make(map[string]CountrySubdivisions)
	storeMutex              sync.RWMutex
)

// UnmarshalCountrySubdivisions parses JSON data into a CountrySubdivisions struct.
// Deprecated: This function is kept for backward compatibility but data is now loaded from external package.
func UnmarshalCountrySubdivisions(data []byte) (CountrySubdivisions, error) {
	var r CountrySubdivisions
	// This is a stub - actual data comes from external package
	return r, nil
}

// Marshal converts a CountrySubdivisions struct into JSON data.
func (r *CountrySubdivisions) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// CountrySubdivisions contains information about country subdivisions.
type CountrySubdivisions struct {
	CountryName string           `json:"country_name"` // CountryName represents the name of the country.
	States      map[string]State `json:"states"`       // States contains information about states or provinces within the country.
}

// GetCountryName returns the name of the country.
func (r *CountrySubdivisions) GetCountryName() string {
	return r.CountryName
}

// GetStates returns information about states or provinces within the country.
func (r *CountrySubdivisions) GetStates() map[string]State {
	return r.States
}
func (r *CountrySubdivisions) GetStateByStateCode(code string) (State, bool) {
	if _, exists := r.States[code]; exists {
		return r.States[code], true
	}
	return State{}, false
}

// GetCountrySubdivisions retrieves subdivision information for a specific country code.
func GetCountrySubdivisions(code string) CountrySubdivisions {
	// Check cache first
	storeMutex.RLock()
	if cached, present := countrySubDivisionStore[code]; present {
		storeMutex.RUnlock()
		return cached
	}
	storeMutex.RUnlock()

	// Get data from external package using data_loader
	protoSubDiv, err := external.GetCountrySubdivisions(code)
	if err != nil || protoSubDiv == nil {
		fmt.Printf("Error loading country subdivisions for %s: %v\n", code, err)
		return CountrySubdivisions{}
	}

	// Convert from proto type to our internal type
	allSubDivData := convertProtoToCountrySubdivisions(protoSubDiv)

	// Store in cache
	storeMutex.Lock()
	countrySubDivisionStore[code] = allSubDivData
	storeMutex.Unlock()

	return allSubDivData
}

// convertProtoToCountrySubdivisions converts proto CountrySubdivisions to our internal type
func convertProtoToCountrySubdivisions(proto *external.CountrySubdivisions) CountrySubdivisions {
	if proto == nil {
		return CountrySubdivisions{}
	}

	states := make(map[string]State)
	if proto.States != nil {
		for stateCode, protoState := range proto.States {
			if protoState != nil {
				cities := make(map[string]City)
				if protoState.Cities != nil {
					for cityName, protoCity := range protoState.Cities {
						if protoCity != nil {
							cities[cityName] = City{
								Name:       protoCity.GetName(),
								RegionName: protoCity.GetRegionName(),
								Timezone:   protoCity.GetTimezone(),
								Zipcodes:   protoCity.GetZipcodes(),
							}
						}
					}
				}
				states[stateCode] = State{
					Name:   protoState.GetName(),
					Cities: cities,
				}
			}
		}
	}

	return CountrySubdivisions{
		CountryName: proto.GetCountryName(),
		States:      states,
	}
}

// NewCountrySubdivisions creates a new CountrySubdivisions instance.
func NewCountrySubdivisions(countryName string, states map[string]State) *CountrySubdivisions {
	return &CountrySubdivisions{
		CountryName: countryName,
		States:      states,
	}
}

// State contains information about a state or province.
type State struct {
	Cities map[string]City `json:"cities"` // Cities contains information about cities within the state.
	Name   string          `json:"name"`   // Name represents the name of the state.
}

// GetCities returns information about cities within the state.
func (r *State) GetCities() []City {
	cities := make([]City, 0, len(r.Cities))
	for _, city := range r.Cities {
		cities = append(cities, city)
	}
	return cities
}

// GetName returns the name of the state.
func (r *State) GetName() string {
	return r.Name
}

// NewState creates a new State instance.
func NewState(cities map[string]City, name string) *State {
	return &State{
		Cities: cities,
		Name:   name,
	}
}

// City contains information about a city.
type City struct {
	Name       string   `json:"name"`                      // Name represents the name of the city.
	RegionName string   `json:"region_name/district_name"` // RegionName represents the region or district name of the city.
	Timezone   string   `json:"timezone"`                  // Timezone represents the timezone of the city.
	Zipcodes   []string `json:"zipcodes"`                  // Zipcodes contains postal codes for the city.
}

// GetName returns the name of the city.
func (r *City) GetName() string {
	return r.Name
}

// GetRegionNameDistrictName returns the region or district name of the city.
func (r *City) GetRegionNameDistrictName() string {
	return r.RegionName
}

// GetTimezone returns the timezone of the city.
func (r *City) GetTimezone() string {
	return r.Timezone
}

// GetZipcodes returns postal codes for the city.
func (r *City) GetZipcodes() []string {
	return r.Zipcodes
}

// IsValidZipCode returns whether the input zipcode is valid for the city.
func (r *City) IsValidZipCode(zipcode string) bool {
	for _, code := range r.Zipcodes {
		if code == zipcode {
			return true
		}
	}
	return false
}

// NewCity creates a new City instance.
func NewCity(name string, regionName string, timezone string, zipcodes []string) *City {
	return &City{
		Name:       name,
		RegionName: regionName,
		Timezone:   timezone,
		Zipcodes:   zipcodes,
	}
}
