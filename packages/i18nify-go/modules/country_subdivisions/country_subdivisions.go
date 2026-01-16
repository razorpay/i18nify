// Package country_subdivisions provides functionality to manage subdivisions
// (such as states, provinces, or regions) and cities within countries.
package country_subdivisions

import (
	"fmt"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions"
)

// CountrySubdivisions contains information about country subdivisions.
type CountrySubdivisions struct {
	CountryName string           `json:"country_name"`
	States      map[string]State `json:"states"`
}

// State contains information about a state or province.
type State struct {
	Name   string          `json:"name"`
	Cities map[string]City `json:"cities"`
}

// City contains information about a city.
type City struct {
	Name       string   `json:"name"`
	RegionName string   `json:"region_name/district_name"`
	Timezone   string   `json:"timezone"`
	Zipcodes   []string `json:"zipcodes"`
}

// GetCountryName returns the name of the country.
func (r *CountrySubdivisions) GetCountryName() string {
	return r.CountryName
}

// GetStates returns information about states or provinces within the country.
func (r *CountrySubdivisions) GetStates() map[string]State {
	return r.States
}

// GetStateByStateCode returns a state by its code.
func (r *CountrySubdivisions) GetStateByStateCode(code string) (State, bool) {
	if state, exists := r.States[code]; exists {
		return state, true
	}
	return State{}, false
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

// NewCountrySubdivisions creates a new CountrySubdivisions instance.
func NewCountrySubdivisions(countryName string, states map[string]State) *CountrySubdivisions {
	return &CountrySubdivisions{
		CountryName: countryName,
		States:      states,
	}
}

// NewState creates a new State instance.
func NewState(cities map[string]City, name string) *State {
	return &State{
		Cities: cities,
		Name:   name,
	}
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

// convertFromDataSource converts data source types to internal types.
func convertFromDataSource(src *dataSource.CountrySubdivisions) CountrySubdivisions {
	if src == nil {
		return CountrySubdivisions{}
	}

	states := make(map[string]State, len(src.States))
	for stateCode, srcState := range src.States {
		cities := make(map[string]City, len(srcState.Cities))
		for cityName, srcCity := range srcState.Cities {
			cities[cityName] = City{
				Name:       srcCity.Name,
				RegionName: srcCity.RegionName,
				Timezone:   srcCity.Timezone,
				Zipcodes:   srcCity.Zipcodes,
			}
		}
		states[stateCode] = State{
			Name:   srcState.Name,
			Cities: cities,
		}
	}

	return CountrySubdivisions{
		CountryName: src.CountryName,
		States:      states,
	}
}

// GetCountrySubdivisions retrieves subdivision information for a specific country code.
func GetCountrySubdivisions(code string) CountrySubdivisions {
	srcData, err := dataSource.GetCountrySubdivisions(code)
	if err != nil {
		fmt.Println("Error loading country subdivisions:", err)
		return CountrySubdivisions{}
	}
	return convertFromDataSource(srcData)
}

// GetAvailableCountryCodes returns a list of available country codes.
func GetAvailableCountryCodes() ([]string, error) {
	return dataSource.GetAvailableCountryCodes()
}
