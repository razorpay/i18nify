// Hand-written Go structs mirroring address.proto.
// Matches the canonical i18nify-data/address/data.json schema.

package address

import "encoding/json"

// AddressData is the root container parsed from data.json.
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
	Template string `json:"template,omitempty"`
	RequiredFields []string `json:"required_fields,omitempty"`
	AllowedFields []string `json:"allowed_fields,omitempty"`
	LatinTemplate string `json:"latin_template,omitempty"`
	UpperCaseFields []string `json:"upper_case_fields,omitempty"`
	ZipNameType string `json:"zip_name_type,omitempty"`
	StateNameType string `json:"state_name_type,omitempty"`
	LocalityNameType string `json:"locality_name_type,omitempty"`
	SublocalityNameType string `json:"sublocality_name_type,omitempty"`
	Lang string `json:"lang,omitempty"`
	Languages json.RawMessage `json:"languages,omitempty"`
	ZipRegex string `json:"zip_regex,omitempty"`
	Zipex string `json:"zipex,omitempty"`
	Posturl string `json:"posturl,omitempty"`
}

func (x *AddressInfo) GetCountryName() string {
	if x != nil {
		return x.CountryName
	}
	return ""
}

func (x *AddressInfo) GetTemplate() string {
	if x != nil {
		return x.Template
	}
	return ""
}

func (x *AddressInfo) GetRequiredFields() []string {
	if x != nil {
		return x.RequiredFields
	}
	return nil
}

func (x *AddressInfo) GetAllowedFields() []string {
	if x != nil {
		return x.AllowedFields
	}
	return nil
}

func (x *AddressInfo) GetLatinTemplate() string {
	if x != nil {
		return x.LatinTemplate
	}
	return ""
}

func (x *AddressInfo) GetUpperCaseFields() []string {
	if x != nil {
		return x.UpperCaseFields
	}
	return nil
}

func (x *AddressInfo) GetZipNameType() string {
	if x != nil {
		return x.ZipNameType
	}
	return ""
}

func (x *AddressInfo) GetStateNameType() string {
	if x != nil {
		return x.StateNameType
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

func (x *AddressInfo) GetLang() string {
	if x != nil {
		return x.Lang
	}
	return ""
}

func (x *AddressInfo) GetLanguages() json.RawMessage {
	if x != nil {
		return x.Languages
	}
	return nil
}

func (x *AddressInfo) GetZipRegex() string {
	if x != nil {
		return x.ZipRegex
	}
	return ""
}

func (x *AddressInfo) GetZipex() string {
	if x != nil {
		return x.Zipex
	}
	return ""
}

func (x *AddressInfo) GetPosturl() string {
	if x != nil {
		return x.Posturl
	}
	return ""
}
