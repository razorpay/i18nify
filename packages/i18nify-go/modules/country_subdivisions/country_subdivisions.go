// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countrySubdivisions, err := UnmarshalCountrySubdivisions(bytes)
//    bytes, err = countrySubdivisions.Marshal()

package country_subdivisions

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

const DataFile = "modules/country_subdivisions/"

func UnmarshalCountrySubdivisions(data []byte) (CountrySubdivisions, error) {
	var r CountrySubdivisions
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *CountrySubdivisions) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type CountrySubdivisions struct {
	CountryName string           `json:"country_name"`
	States      map[string]State `json:"states"`
}

func (r *CountrySubdivisions) GetCountryName() string {
	return r.CountryName
}

func (r *CountrySubdivisions) GetStates() map[string]State {
	return r.States
}

func GetCountrySubdivisions(code string) CountrySubdivisions {
	subDivJsonData, err := ioutil.ReadFile(DataFile + code + ".json")
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return CountrySubdivisions{}
	}
	allSubDivData, _ := UnmarshalCountrySubdivisions(subDivJsonData)
	return allSubDivData
}

func NewCountrySubdivisions(countryName string, states map[string]State) *CountrySubdivisions {
	return &CountrySubdivisions{
		CountryName: countryName,
		States:      states,
	}
}

type State struct {
	Cities []City `json:"cities"`
	Name   string `json:"name"`
}

func (r *State) GetCities() []City {
	return r.Cities
}

func (r *State) GetName() string {
	return r.Name
}

func NewState(cities []City, name string) *State {
	return &State{
		Cities: cities,
		Name:   name,
	}
}

type City struct {
	Name       string   `json:"name"`
	RegionName string   `json:"region_name/district_name"`
	Timezone   string   `json:"timezone"`
	Zipcodes   []string `json:"zipcodes"`
}

func (r *City) GetName() string {
	return r.Name
}

func (r *City) GetRegionNameDistrictName() string {
	return r.RegionName
}

func (r *City) GetTimezone() string {
	return r.Timezone
}

func (r *City) GetZipcodes() []string {
	return r.Zipcodes
}

func NewCity(name string, regionName string, timezone string, zipcodes []string) *City {
	return &City{
		Name:       name,
		RegionName: regionName,
		Timezone:   timezone,
		Zipcodes:   zipcodes,
	}
}
