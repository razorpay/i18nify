// Package country_metadata provides functionality to handle metadata information about countries.
package country_metadata

import (
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/country-metadata"
)

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
	// Get data from dataSource package using data_loader
	data := dataSource.GetData()

	// Get the proto type for the country code
	protoInfo, exists := data[code]
	if !exists || protoInfo == nil {
		return MetadataInformation{}
	}

	// Convert from proto type to our internal type
	return convertProtoToMetadataInformation(protoInfo)
}

// convertProtoToMetadataInformation converts proto MetadataInformation to our internal type
func convertProtoToMetadataInformation(proto *dataSource.MetadataInformation) MetadataInformation {
	if proto == nil {
		return MetadataInformation{}
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
		Locales:           convertProtoLocales(proto.Locales),
		NumericCode:       proto.GetNumericCode(),
		Sovereignty:       proto.GetSovereignty(),
		TimezoneOfCapital: proto.GetTimezoneOfCapital(),
		Timezones:         convertProtoTimezones(proto.Timezones),
		DefaultCurrency:   proto.GetDefaultCurrency(),
	}
}

// convertProtoLocales converts a map of proto Locales to our internal Locale map
func convertProtoLocales(protoLocales map[string]*dataSource.Locale) map[string]Locale {
	if protoLocales == nil {
		return make(map[string]Locale)
	}

	locales := make(map[string]Locale, len(protoLocales))
	for k, v := range protoLocales {
		if v != nil {
			locales[k] = Locale{
				Name: v.GetName(),
			}
		}
	}
	return locales
}

// convertProtoTimezones converts a map of proto Timezones to our internal Timezone map
func convertProtoTimezones(protoTimezones map[string]*dataSource.Timezone) map[string]Timezone {
	if protoTimezones == nil {
		return make(map[string]Timezone)
	}

	timezones := make(map[string]Timezone, len(protoTimezones))
	for k, v := range protoTimezones {
		if v != nil {
			timezones[k] = Timezone{
				UTCOffset: v.GetUtcOffset(),
			}
		}
	}
	return timezones
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
	// Get data from dataSource package using data_loader
	data := dataSource.GetData()

	normalizedName := strings.ToUpper(strings.TrimSpace(countryName))
	for code, protoInfo := range data {
		if protoInfo != nil && strings.ToUpper(protoInfo.GetCountryName()) == normalizedName {
			return code
		}
	}

	return ""
}
