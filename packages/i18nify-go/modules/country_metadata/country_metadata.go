// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryMetadata, err := UnmarshalCountryMetadata(bytes)
//    bytes, err = countryMetadata.Marshal()

package country_metadata

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

const DataFile = "modules/country_metadata/data.json"

func UnmarshalCountryMetadata(data []byte) (CountryMetadata, error) {
	var r CountryMetadata
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *CountryMetadata) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type CountryMetadata struct {
	MetadataInformation map[string]MetadataInformation `json:"metadata_information"`
}

func (r *CountryMetadata) GetAllMetadataInformation() map[string]MetadataInformation {
	return r.MetadataInformation
}

func GetMetadataInformation(code string) MetadataInformation {
	metaJsonData, err := ioutil.ReadFile(DataFile)
	allCountryMetaData, err := UnmarshalCountryMetadata(metaJsonData)
	if err != nil {
		fmt.Printf("Error unmarshalling country metadata: %v", err)
		return MetadataInformation{}
	}
	return allCountryMetaData.MetadataInformation[code]
}

func NewCountryMetadata(metadataInformation map[string]MetadataInformation) *CountryMetadata {
	return &CountryMetadata{
		MetadataInformation: metadataInformation,
	}
}

type MetadataInformation struct {
	Alpha3            string              `json:"alpha_3"`
	ContinentCode     string              `json:"continent_code"`
	ContinentName     string              `json:"continent_name"`
	CountryName       string              `json:"country_name"`
	Currency          []string            `json:"currency"`
	DefaultLocale     string              `json:"default_locale"`
	DialCode          string              `json:"dial_code"`
	Flag              string              `json:"flag"`
	Locales           []Locale            `json:"locales"`
	NumericCode       string              `json:"numeric_code"`
	Sovereignty       string              `json:"sovereignty"`
	TimezoneOfCapital string              `json:"timezone_of_capital"`
	Timezones         map[string]Timezone `json:"timezones"`
}

func (r *MetadataInformation) GetAlpha3() string {
	return r.Alpha3
}

func (r *MetadataInformation) GetContinentCode() string {
	return r.ContinentCode
}

func (r *MetadataInformation) GetContinentName() string {
	return r.ContinentName
}

func (r *MetadataInformation) GetCountryName() string {
	return r.CountryName
}

func (r *MetadataInformation) GetCurrency() []string {
	return r.Currency
}

func (r *MetadataInformation) GetDefaultLocale() string {
	return r.DefaultLocale
}

func (r *MetadataInformation) GetDialCode() string {
	return r.DialCode
}

func (r *MetadataInformation) GetFlag() string {
	return r.Flag
}

func (r *MetadataInformation) GetLocales() []Locale {
	return r.Locales
}

func (r *MetadataInformation) GetNumericCode() string {
	return r.NumericCode
}

func (r *MetadataInformation) GetSovereignty() string {
	return r.Sovereignty
}

func (r *MetadataInformation) GetTimezoneOfCapital() string {
	return r.TimezoneOfCapital
}

func (r *MetadataInformation) GetTimezones() map[string]Timezone {
	return r.Timezones
}

func NewMetadataInformation(alpha_3 string, continentCode string, continentName string, countryName string, currency []string, defaultLocale string, dialCode string, flag string, locales []Locale, numericCode string, sovereignty string, timezoneOfCapital string, timezones map[string]Timezone) *MetadataInformation {
	return &MetadataInformation{
		Alpha3:            alpha_3,
		ContinentCode:     continentCode,
		ContinentName:     continentName,
		CountryName:       countryName,
		Currency:          currency,
		DefaultLocale:     defaultLocale,
		DialCode:          dialCode,
		Flag:              flag,
		Locales:           locales,
		NumericCode:       numericCode,
		Sovereignty:       sovereignty,
		TimezoneOfCapital: timezoneOfCapital,
		Timezones:         timezones,
	}
}

type Locale struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

func (r *Locale) GetCode() string {
	return r.Code
}

func (r *Locale) GetName() string {
	return r.Name
}

func NewLocale(code string, name string) *Locale {
	return &Locale{
		Code: code,
		Name: name,
	}
}

type Timezone struct {
	UTCOffset string `json:"utc_offset"`
}

func (r *Timezone) GetUTCOffset() string {
	return r.UTCOffset
}

func NewTimezone(utcOffset string) *Timezone {
	return &Timezone{
		UTCOffset: utcOffset,
	}
}
