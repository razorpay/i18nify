// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryMetadata, err := UnmarshalCountryMetadata(bytes)
//    bytes, err = countryMetadata.Marshal()

// Package country_metadata provides functionality to handle metadata information about countries.
package country_metadata

import (
	"strings"

	external "github.com/razorpay/i18nify/i18nify-data/go/country-metadata"
)

// UnmarshalCountryMetadata parses JSON data into a CountryMetadata struct.
// Deprecated: This function is kept for backward compatibility but data is now loaded from external package.
func UnmarshalCountryMetadata(data []byte) (CountryMetadata, error) {
	var r CountryMetadata
	// This is a stub - actual data comes from external package
	return r, nil
}

// Marshal converts a CountryMetadata struct into JSON data.
func (r *CountryMetadata) Marshal() ([]byte, error) {
	// This is a stub - actual data comes from external package
	return nil, nil
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
	// Get data from external package using data_loader
	data := external.GetData()

	// Get the proto type for the country code
	protoInfo, exists := data[code]
	if !exists || protoInfo == nil {
		return MetadataInformation{}
	}

	// Convert from proto type to our internal type
	return convertProtoToMetadataInformation(protoInfo)
}

// convertProtoToMetadataInformation converts proto MetadataInformation to our internal type
func convertProtoToMetadataInformation(proto *external.MetadataInformation) MetadataInformation {
	if proto == nil {
		return MetadataInformation{}
	}

	// Convert locales map
	locales := make(map[string]Locale)
	if proto.Locales != nil {
		for k, v := range proto.Locales {
			if v != nil {
				locales[k] = Locale{
					Name: v.GetName(),
				}
			}
		}
	}

	// Convert timezones map
	timezones := make(map[string]Timezone)
	if proto.Timezones != nil {
		for k, v := range proto.Timezones {
			if v != nil {
				timezones[k] = Timezone{
					UTCOffset: v.GetUtcOffset(),
				}
			}
		}
	}

	return MetadataInformation{
		Alpha3:            proto.GetAlpha_3(),
		ContinentCode:     proto.GetContinentCode(),
		ContinentName:     proto.GetContinentName(),
		CountryName:       proto.GetCountryName(),
		SupportedCurrency: proto.GetSupportedCurrency(),
		DefaultLocale:     proto.GetDefaultLocale(),
		DialCode:          proto.GetDialCode(),
		Flag:              proto.GetFlag(),
		Locales:           locales,
		NumericCode:       proto.GetNumericCode(),
		Sovereignty:       proto.GetSovereignty(),
		TimezoneOfCapital: proto.GetTimezoneOfCapital(),
		Timezones:         timezones,
		DefaultCurrency:   proto.GetDefaultCurrency(),
	}
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

func GetCountryCodeISO2(countryName string) string {
	// Get data from external package using data_loader
	data := external.GetData()

	normalizedName := strings.ToUpper(strings.TrimSpace(countryName))
	for code, protoInfo := range data {
		if protoInfo != nil && strings.ToUpper(protoInfo.GetCountryName()) == normalizedName {
			return code
		}
	}

	return ""
}
