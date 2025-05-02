package i18nify_go

import (
	"fmt"
	metadata "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	"strings"
)

type CountryCode struct {
	Name string //
}

// GetCountryCodeISO2 returns the ISO 3166-1 alpha-2 country code for a given country name
func (c CountryCode) GetCountryCodeISO2() string {
	metaJsonData, err := metadata.MetaJsonDir.ReadFile(metadata.DataFile)
	if err != nil {
		fmt.Printf("Error reading country metadata file: %v", err)
		return ""
	}

	allCountryMetaData, err := metadata.UnmarshalCountryMetadata(metaJsonData)
	if err != nil {
		fmt.Printf("Error unmarshalling country metadata: %v", err)
		return ""
	}
	normalizedName := strings.ToUpper(strings.TrimSpace(c.Name))
	for code, info := range allCountryMetaData.MetadataInformation {
		if strings.ToUpper(info.CountryName) == normalizedName {
			return code
		}
	}

	return ""
}

func NewCountryCode(name string) ICountryCode {
	return &CountryCode{
		Name: name,
	}
}
