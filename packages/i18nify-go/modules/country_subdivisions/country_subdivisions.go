// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countrySubdivisions, err := UnmarshalCountrySubdivisions(bytes)
//    bytes, err = countrySubdivisions.Marshal()

// Package country_subdivisions provides functionality to manage subdivisions (such as states, provinces, or regions) and cities within countries.
package country_subdivisions

import (
	"embed"
	"encoding/json"
	"fmt"
	"path/filepath"
)

//go:embed data
var subDivJsonDir embed.FS

// Cache to avoid duplicate reads for same countryCode
var countrySubDivisionStore = make(map[string]CountrySubdivisions)

// DataFile is the directory where JSON files containing country subdivision data are stored. "

// UnmarshalCountrySubdivisions parses JSON data into a CountrySubdivisions struct.
func UnmarshalCountrySubdivisions(data []byte) (CountrySubdivisions, error) {
	var r CountrySubdivisions
	err := json.Unmarshal(data, &r)
	return r, err
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
	if _, present := countrySubDivisionStore[code]; present {
		return countrySubDivisionStore[code]
	}
	// Read JSON data file containing country subdivision information.
	completePath := filepath.Join("data/", code+".json")
	subDivJsonData, err := subDivJsonDir.ReadFile(completePath)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return CountrySubdivisions{}
	}
	// Unmarshal JSON data into CountrySubdivisions struct.
	allSubDivData, _ := UnmarshalCountrySubdivisions(subDivJsonData)
	// Store calculated CountrySubDivisions into the cache
	countrySubDivisionStore[code] = allSubDivData
	return allSubDivData
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
	Cities []City `json:"cities"` // Cities contains information about cities within the state.
	Name   string `json:"name"`   // Name represents the name of the state.
}

// GetCities returns information about cities within the state.
func (r *State) GetCities() []City {
	return r.Cities
}

// GetName returns the name of the state.
func (r *State) GetName() string {
	return r.Name
}

// NewState creates a new State instance.
func NewState(cities []City, name string) *State {
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
