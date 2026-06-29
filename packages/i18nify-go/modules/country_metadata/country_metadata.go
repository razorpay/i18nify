// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryMetadata, err := UnmarshalCountryMetadata(bytes)
//    bytes, err = countryMetadata.Marshal()

// Package country_metadata provides functionality to handle metadata information about countries.
package country_metadata

import (
	"encoding/json"
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

// Package-level cache for country meta_data (loaded once at package initialization)
var cachedCountyMetaData *CountryMetadata

// init loads the country metadata from the externalized data package when the package is imported.
func init() {
	src, err := dataSource.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("failed to load country metadata: %v", err))
	}

	data := convertFromDataSource(src)
	cachedCountyMetaData = &data
}

// convertFromDataSource maps the proto-generated CountryMetadataData to the module's CountryMetadata type.
func convertFromDataSource(src *dataSource.CountryMetadataData) CountryMetadata {
	if src == nil {
		return CountryMetadata{}
	}
	info := make(map[string]MetadataInformation, len(src.GetMetadataInformation()))
	for code, cm := range src.GetMetadataInformation() {
		if cm == nil {
			continue
		}
		timezones := make(map[string]Timezone, len(cm.GetTimezones()))
		for tzKey, tzVal := range cm.GetTimezones() {
			if tzVal != nil {
				timezones[tzKey] = Timezone{UTCOffset: tzVal.GetUtcOffset()}
			}
		}
		locales := make(map[string]Locale, len(cm.GetLocales()))
		for locKey, locVal := range cm.GetLocales() {
			if locVal != nil {
				locales[locKey] = Locale{Name: locVal.GetName()}
			}
		}
		info[code] = MetadataInformation{
			Alpha3:            cm.GetAlpha_3(),
			ContinentCode:     cm.GetContinentCode(),
			ContinentName:     cm.GetContinentName(),
			CountryName:       cm.GetCountryName(),
			SupportedCurrency: cm.GetSupportedCurrency(),
			DefaultLocale:     cm.GetDefaultLocale(),
			DialCode:          cm.GetDialCode(),
			Flag:              cm.GetFlag(),
			Locales:           locales,
			NumericCode:       cm.GetNumericCode(),
			Sovereignty:       cm.GetSovereignty(),
			TimezoneOfCapital: cm.GetTimezoneOfCapital(),
			Timezones:         timezones,
			DefaultCurrency:   cm.GetDefaultCurrency(),
			AddressTemplate:   cm.GetAddressFormat(),
		}
	}
	return CountryMetadata{MetadataInformation: info}
}

// UnmarshalCountryMetadata parses JSON data into a CountryMetadata struct.
func UnmarshalCountryMetadata(data []byte) (CountryMetadata, error) {
	var r CountryMetadata
	err := json.Unmarshal(data, &r)
	return r, err
}

// Marshal converts a CountryMetadata struct into JSON data.
func (r *CountryMetadata) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// CountryMetadata represents metadata information about countries.
type CountryMetadata struct {
	// MetadataInformation holds metadata information for each country, keyed by country code.
	MetadataInformation map[string]MetadataInformation `json:"metadata_information"`
}

// GetAllMetadataInformation returns all metadata information about countries.
func (r *CountryMetadata) GetAllMetadataInformation() map[string]MetadataInformation {
	return r.MetadataInformation
}

// GetMetadataInformation retrieves metadata information for a specific country code.
func GetMetadataInformation(code string) MetadataInformation {
	countryMetadataInfo, exists := cachedCountyMetaData.MetadataInformation[code]
	if !exists {
		fmt.Printf("failed to retrive the country metadata for country code: %s", code)
		return MetadataInformation{}
	}

	return countryMetadataInfo
}

// GetMetadataInformationByISONumericCode retrieves metadata information for a specific ISO 3166-1 numeric code.
func GetMetadataInformationByISONumericCode(numericCode string) MetadataInformation {
	for _, info := range cachedCountyMetaData.MetadataInformation {
		if info.NumericCode == numericCode {
			return info
		}
	}
	fmt.Printf("failed to retrive the country metadata for numeric code: %s", numericCode)
	return MetadataInformation{}
}

// NewCountryMetadata creates a new CountryMetadata instance.
func NewCountryMetadata(metadataInformation map[string]MetadataInformation) *CountryMetadata {
	return &CountryMetadata{
		MetadataInformation: metadataInformation,
	}
}

// MetadataInformation contains detailed information about a specific country.
type MetadataInformation struct {
	Alpha3            string              `json:"alpha_3"`             // Alpha3 represents the ISO 3166-1 alpha-3 code of the country.
	ContinentCode     string              `json:"continent_code"`      // ContinentCode represents the continent code of the country.
	ContinentName     string              `json:"continent_name"`      // ContinentName represents the name of the continent where the country belongs.
	CountryName       string              `json:"country_name"`        // CountryName represents the official name of the country.
	SupportedCurrency []string            `json:"supported_currency"`  // SupportedCurrency represents the official currencies used in the country.
	DefaultLocale     string              `json:"default_locale"`      // DefaultLocale represents the default locale used in the country.
	DialCode          string              `json:"dial_code"`           // DialCode represents the international dialing code of the country.
	Flag              string              `json:"flag"`                // Flag represents the flag emoji or image URL of the country.
	Locales           map[string]Locale   `json:"locales"`             // Locales represents the list of supported locales in the country.
	NumericCode       string              `json:"numeric_code"`        // NumericCode represents the ISO 3166-1 numeric code of the country.
	Sovereignty       string              `json:"sovereignty"`         // Sovereignty represents the official sovereignty status of the country.
	TimezoneOfCapital string              `json:"timezone_of_capital"` // TimezoneOfCapital represents the timezone of the capital city of the country.
	Timezones         map[string]Timezone `json:"timezones"`           // Timezones represents the list of timezones used in the country, keyed by timezone identifier.
	DefaultCurrency   string              `json:"default_currency"`    // DefaultCurrency represents the default currency used in the country.
	// AddressTemplate represents the country-specific address formatting template.
	AddressTemplate string `json:"address_template,omitempty"`
}

// NewMetadataInformation creates a new MetadataInformation instance.
func NewMetadataInformation(alpha_3 string, continentCode string, continentName string, countryName string, currency []string, defaultCurrency string, defaultLocale string, dialCode string, flag string, locales map[string]Locale, numericCode string, sovereignty string, timezoneOfCapital string, timezones map[string]Timezone) *MetadataInformation {
	return &MetadataInformation{
		Alpha3:            alpha_3,
		ContinentCode:     continentCode,
		ContinentName:     continentName,
		CountryName:       countryName,
		SupportedCurrency: currency,
		DefaultLocale:     defaultLocale,
		DialCode:          dialCode,
		Flag:              flag,
		Locales:           locales,
		NumericCode:       numericCode,
		Sovereignty:       sovereignty,
		TimezoneOfCapital: timezoneOfCapital,
		Timezones:         timezones,
		DefaultCurrency:   defaultCurrency,
	}
}

// Locale represents a locale with its code and name.
type Locale struct {
	Name string `json:"name"` // Name represents the name of the locale.
}

// NewLocale creates a new Locale instance.
func NewLocale(name string) *Locale {
	return &Locale{
		Name: name,
	}
}

// Timezone represents a timezone with its UTC offset.
type Timezone struct {
	UTCOffset string `json:"utc_offset"` // UTCOffset represents the UTC offset of the timezone.
}

// NewTimezone creates a new Timezone instance.
func NewTimezone(utcOffset string) *Timezone {
	return &Timezone{
		UTCOffset: utcOffset,
	}
}

// GetCountryCodeFromAlpha3 returns the ISO 3166-1 alpha-2 country code for a given alpha-3 code.
func GetCountryCodeFromAlpha3(alpha3 string) string {
	normalized := strings.ToUpper(strings.TrimSpace(alpha3))
	for iso2, info := range cachedCountyMetaData.MetadataInformation {
		if info.Alpha3 == normalized {
			return iso2
		}
	}
	return ""
}

func GetCountryCodeISO2(countryName string) string {
	normalizedName := strings.ToUpper(strings.TrimSpace(countryName))
	for code, info := range cachedCountyMetaData.MetadataInformation {
		if strings.ToUpper(info.CountryName) == normalizedName {
			return code
		}
	}
	return ""
}

// AddressComponents holds address field values for template substitution.
// All fields are optional; empty fields substitute as blank strings and
// lines that become blank after substitution are dropped from the output.
type AddressComponents struct {
	Name          string
	Organization  string
	StreetAddress string
	City          string
	State         string
	Zip           string
	District      string
	SortingCode   string
}

// FormatAddressWithFormat formats address components using the country-specific
// template for countryCode. The template is sourced from the country metadata
// (MetadataInformation.AddressTemplate). Each {placeholder} in the template is
// replaced with the matching field; blank lines in the result are removed.
func FormatAddressWithFormat(countryCode string, components AddressComponents) (string, error) {
	if strings.TrimSpace(countryCode) == "" {
		return "", fmt.Errorf("formatAddressWithFormat: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	template := GetMetadataInformation(code).AddressTemplate
	if template == "" {
		return "", fmt.Errorf("formatAddressWithFormat: address format for country code %q not found", code)
	}

	replacer := strings.NewReplacer(
		"{name}", components.Name,
		"{organization}", components.Organization,
		"{street_address}", components.StreetAddress,
		"{city}", components.City,
		"{state}", components.State,
		"{zip}", components.Zip,
		"{district}", components.District,
		"{sorting_code}", components.SortingCode,
	)
	substituted := replacer.Replace(template)

	// Drop any lines that are blank after substitution — this happens when an
	// optional field (e.g. Organization) was not provided.
	rawLines := strings.Split(substituted, "\n")
	formatted := make([]string, 0, len(rawLines))
	for _, line := range rawLines {
		if trimmed := strings.TrimSpace(line); trimmed != "" {
			formatted = append(formatted, trimmed)
		}
	}

	return strings.Join(formatted, "\n"), nil
}
