// Hand-written Go structs mirroring address.proto — protoc not available.
// Matches the canonical i18nify-data/address/data.json schema.

package address

import "encoding/json"

// StringOrSlice unmarshals a JSON value that is either a bare string or an
// array of strings (both forms appear in the address data for "languages").
type StringOrSlice []string

func (s *StringOrSlice) UnmarshalJSON(data []byte) error {
	var arr []string
	if err := json.Unmarshal(data, &arr); err == nil {
		*s = arr
		return nil
	}
	var str string
	if err := json.Unmarshal(data, &str); err != nil {
		return err
	}
	*s = []string{str}
	return nil
}

// AddressData is the root container.
type AddressData struct {
	AddressFormatInformation map[string]*AddressInfo `json:"address_format_information,omitempty"`
}

func (x *AddressData) GetAddressFormatInformation() map[string]*AddressInfo {
	if x != nil {
		return x.AddressFormatInformation
	}
	return nil
}

// AddressInfo holds all fields for a single address entry.
type AddressInfo struct {
	CountryName string `json:"country_name,omitempty"`
	Fmt string `json:"fmt,omitempty"`
	ZipRegex string `json:"zip_regex,omitempty"`
	ZipExample string `json:"zip_example,omitempty"`
	Lang string `json:"lang,omitempty"`
	Languages StringOrSlice `json:"languages,omitempty"`
	PostUrl string `json:"post_url,omitempty"`
	SubKeys []string `json:"sub_keys,omitempty"`
	SubNames []string `json:"sub_names,omitempty"`
	SubIsoids []string `json:"sub_isoids,omitempty"`
	Require string `json:"require,omitempty"`
	StateNameType string `json:"state_name_type,omitempty"`
	ZipNameType string `json:"zip_name_type,omitempty"`
	LocalityNameType string `json:"locality_name_type,omitempty"`
	SublocalityNameType string `json:"sublocality_name_type,omitempty"`
}

func (x *AddressInfo) GetCountryName() string {
	if x != nil {
		return x.CountryName
	}
	return ""
}

func (x *AddressInfo) GetFmt() string {
	if x != nil {
		return x.Fmt
	}
	return ""
}

func (x *AddressInfo) GetZipRegex() string {
	if x != nil {
		return x.ZipRegex
	}
	return ""
}

func (x *AddressInfo) GetZipExample() string {
	if x != nil {
		return x.ZipExample
	}
	return ""
}

func (x *AddressInfo) GetLang() string {
	if x != nil {
		return x.Lang
	}
	return ""
}

func (x *AddressInfo) GetLanguages() []string {
	if x != nil {
		return x.Languages
	}
	return nil
}

func (x *AddressInfo) GetPostUrl() string {
	if x != nil {
		return x.PostUrl
	}
	return ""
}

func (x *AddressInfo) GetSubKeys() []string {
	if x != nil {
		return x.SubKeys
	}
	return nil
}

func (x *AddressInfo) GetSubNames() []string {
	if x != nil {
		return x.SubNames
	}
	return nil
}

func (x *AddressInfo) GetSubIsoids() []string {
	if x != nil {
		return x.SubIsoids
	}
	return nil
}

func (x *AddressInfo) GetRequire() string {
	if x != nil {
		return x.Require
	}
	return ""
}

func (x *AddressInfo) GetStateNameType() string {
	if x != nil {
		return x.StateNameType
	}
	return ""
}

func (x *AddressInfo) GetZipNameType() string {
	if x != nil {
		return x.ZipNameType
	}
	return ""
}

func (x *AddressInfo) GetLocalityNameType() string {
	if x != nil {
		return x.LocalityNameType
	}
	return ""
}

func (x *AddressInfo) GetSublocalityNameType() string {
	if x != nil {
		return x.SublocalityNameType
	}
	return ""
}

