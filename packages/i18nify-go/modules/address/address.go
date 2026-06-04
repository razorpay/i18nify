// Package address provides address information keyed by ISO 3166-1 alpha-2 country code.
package address

import (
	"encoding/json"
	"fmt"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/address"
)

// AddressInfo contains data for a single address entry.
type AddressInfo struct {
	CountryName string `json:"country_name"`
	Fmt string `json:"fmt"`
	ZipRegex string `json:"zip_regex"`
	ZipExample string `json:"zip_example"`
	Lang string `json:"lang"`
	Languages string `json:"languages"`
	PostUrl string `json:"post_url"`
	SubKeys []string `json:"sub_keys"`
	SubNames []string `json:"sub_names"`
	SubIsoids []string `json:"sub_isoids"`
	Require string `json:"require"`
	StateNameType string `json:"state_name_type"`
	ZipNameType string `json:"zip_name_type"`
	LocalityNameType string `json:"locality_name_type"`
	SublocalityNameType string `json:"sublocality_name_type"`
}

// AddressData holds address information keyed by ISO 3166-1 alpha-2 country code.
type AddressData struct {
	AddressFormatInformation map[string]AddressInfo `json:"address_format_information"`
}

var cachedAddressData *AddressData

func init() {
	src, err := dataSource.GetAddressData()
	if err != nil {
		panic(fmt.Sprintf("failed to load address data: %v", err))
	}
	data := convertFromDataSource(src)
	cachedAddressData = &data
}

func convertFromDataSource(src *dataSource.AddressData) AddressData {
	if src == nil {
		return AddressData{}
	}
	info := make(map[string]AddressInfo, len(src.GetAddressFormatInformation()))
	for cc, entry := range src.GetAddressFormatInformation() {
		if entry == nil {
			continue
		}
		b, _ := json.Marshal(entry)
		var v AddressInfo
		if err := json.Unmarshal(b, &v); err != nil {
			continue
		}
		info[cc] = v
	}
	return AddressData{AddressFormatInformation: info}
}

// UnmarshalAddressData parses JSON data into a AddressData struct.
func UnmarshalAddressData(data []byte) (AddressData, error) {
	var r AddressData
	err := json.Unmarshal(data, &r)
	return r, err
}

// GetAddressList returns all address entries keyed by country code.
func GetAddressList() map[string]AddressInfo {
	return cachedAddressData.AddressFormatInformation
}

// GetAddressInfo returns the address entry for the given ISO 3166-1 alpha-2 country code.
func GetAddressInfo(cc string) (AddressInfo, error) {
	if cc == "" {
		return AddressInfo{}, fmt.Errorf("country code cannot be empty")
	}
	info, exists := cachedAddressData.AddressFormatInformation[cc]
	if !exists {
		return AddressInfo{}, fmt.Errorf("Address info for country code '%s' not found", cc)
	}
	return info, nil
}
