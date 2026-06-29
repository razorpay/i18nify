package country_metadata

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestUnmarshalCountryMetadata(t *testing.T) {
	jsonData := []byte(`{"metadata_information":{"IN":{"country_name":"India","continent_code":"AS","continent_name":"Asia","alpha_3":"IND","numeric_code":"356","flag":"https://flagcdn.com/in.svg","sovereignty":"UN member state","dial_code":"+91","supported_currency":["INR"],"timezones":{"Asia/Kolkata":{"utc_offset":"UTC +05:30"}},"timezone_of_capital":"Asia/Kolkata","locales":{"en_IN":{"name":"English (India)"},"hi":{"name":"Hindi"}},"default_locale":"en_IN","default_currency":"INR"}}}`)
	countryMetadata, err := UnmarshalCountryMetadata(jsonData)

	assert.NoError(t, err, "Unexpected error during unmarshal")

	result := countryMetadata.MetadataInformation["IN"]
	assertINMetaData(t, result)
}

func TestMarshalCountryMetadata(t *testing.T) {
	expectedJSON := `{"metadata_information": {"IN": {
      "country_name": "India",
      "continent_code": "AS",
      "continent_name": "Asia",
      "alpha_3": "IND",
      "numeric_code": "356",
      "flag": "https://flagcdn.com/in.svg",
      "sovereignty": "UN member state",
      "dial_code": "+91",
      "supported_currency": [
        "INR"
      ],
      "timezones": {
        "Asia/Kolkata": {
          "utc_offset": "UTC +05:30"
        }
      },
      "timezone_of_capital": "Asia/Kolkata",
      "locales": {
        "en_IN": {
          "name": "English (India)"
        },
        "hi": {
          "name": "Hindi"
        }
      },
      "default_locale": "en_IN",
      "default_currency": "INR"
    }}}`

	locales := make(map[string]Locale)

	locales["en_IN"] = *NewLocale("English (India)")
	locales["hi"] = *NewLocale("Hindi")

	countryMetadata := NewCountryMetadata(map[string]MetadataInformation{
		"IN": *NewMetadataInformation("IND", "AS", "Asia", "India", []string{"INR"}, "INR", "en_IN", "+91", "https://flagcdn.com/in.svg", locales, "356", "UN member state", "Asia/Kolkata", map[string]Timezone{"Asia/Kolkata": *NewTimezone("UTC +05:30")}),
	})
	marshaledJSON, err := countryMetadata.Marshal()
	assert.NoError(t, err)

	assert.JSONEq(t, expectedJSON, string(marshaledJSON))
}

func TestGetMetadataInformation(t *testing.T) {
	result := GetMetadataInformation("IN")
	assertINMetaData(t, result)
}

func TestGetMetadataInformation_AddressTemplate(t *testing.T) {
	result := GetMetadataInformation("US")
	assert.Equal(t, "{name}\n{organization}\n{street_address}\n{city}, {state} {zip}", result.AddressTemplate)
}

func TestGetMetadataInformationByISONumericCode(t *testing.T) {
	tests := []struct {
		name        string
		numericCode string
		validate    func(*testing.T, MetadataInformation)
	}{
		{
			name:        "India by ISO numeric code 356",
			numericCode: "356",
			validate:    func(t *testing.T, result MetadataInformation) { assertINMetaData(t, result) },
		},
		{
			name:        "Afghanistan by ISO numeric code 004",
			numericCode: "004",
			validate: func(t *testing.T, result MetadataInformation) {
				assert.Equal(t, "AFG", result.Alpha3)
				assert.Equal(t, "Afghanistan", result.CountryName)
				assert.Equal(t, "004", result.NumericCode)
			},
		},
		{
			name:        "Albania by ISO numeric code 008",
			numericCode: "008",
			validate: func(t *testing.T, result MetadataInformation) {
				assert.Equal(t, "ALB", result.Alpha3)
				assert.Equal(t, "Albania", result.CountryName)
				assert.Equal(t, "008", result.NumericCode)
			},
		},
		{
			name:        "unknown ISO numeric code returns empty",
			numericCode: "999",
			validate: func(t *testing.T, result MetadataInformation) {
				assert.Empty(t, result.CountryName)
				assert.Empty(t, result.Alpha3)
				assert.Empty(t, result.NumericCode)
			},
		},
		{
			name:        "empty ISO numeric code returns empty",
			numericCode: "",
			validate: func(t *testing.T, result MetadataInformation) {
				assert.Empty(t, result.CountryName)
				assert.Empty(t, result.Alpha3)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetMetadataInformationByISONumericCode(tt.numericCode)
			tt.validate(t, result)
		})
	}
}

func TestNewCountryMetadata(t *testing.T) {
	locales := make(map[string]Locale)
	locales["en_IN"] = *NewLocale("English (India)")

	metadata := map[string]MetadataInformation{
		"IN": *NewMetadataInformation("IND", "AS", "Asia", "India", []string{"INR"}, "INR", "en_IN", "+91", "https://flagcdn.com/in.svg", locales, "356", "UN member state", "Asia/Kolkata", map[string]Timezone{"Asia/Kolkata": *NewTimezone("UTC +05:30")}),
	}
	countryMetadata := NewCountryMetadata(metadata)

	result := countryMetadata.MetadataInformation["IN"]
	assertINMetaData(t, result)
}

func assertINMetaData(t *testing.T, result MetadataInformation) {
	assert.Equal(t, "IND", result.Alpha3, "Alpha3 field mismatch")
	assert.Equal(t, "AS", result.ContinentCode, "ContinentCode field mismatch")
	assert.Equal(t, "Asia", result.ContinentName, "ContinentName field mismatch")
	assert.Equal(t, "356", result.NumericCode, "NumericCode field mismatch")
	assert.Equal(t, "https://flagcdn.com/in.svg", result.Flag, "Flag field mismatch")
	assert.Equal(t, "UN member state", result.Sovereignty, "Sovereignty field mismatch")
	assert.Equal(t, "+91", result.DialCode, "DialCode field mismatch")
	assert.NotNil(t, result.Timezones["Asia/Kolkata"], "TimezoneOfCapital field mismatch")
	assert.Equal(t, "en_IN", result.DefaultLocale, "DefaultLocale field mismatch")
	//assert.Equal(t, Locale{Code: "en_IN", Name: "English (India)"}, result.Locales[0], "Locale field mismatch")
	assert.Equal(t, []string{"INR"}, result.SupportedCurrency, "SupportedCurrency field mismatch")
	assert.Equal(t, Timezone{UTCOffset: "UTC +05:30"}, result.Timezones["Asia/Kolkata"], "Timezones field mismatch")
}

func TestGetCountryCodeFromAlpha3(t *testing.T) {
	coverage := map[string]string{
		"ABW": "AW", "AFG": "AF", "AGO": "AO", "AIA": "AI", "ALA": "AX",
		"ALB": "AL", "AND": "AD", "ARE": "AE", "ARG": "AR", "ARM": "AM",
		"ASM": "AS", "ATA": "AQ", "ATF": "TF", "ATG": "AG", "AUS": "AU",
		"AUT": "AT", "AZE": "AZ", "BDI": "BI", "BEL": "BE", "BEN": "BJ",
		"BES": "BQ", "BFA": "BF", "BGD": "BD", "BGR": "BG", "BHR": "BH",
		"BHS": "BS", "BIH": "BA", "BLM": "BL", "BLR": "BY", "BLZ": "BZ",
		"BMU": "BM", "BOL": "BO", "BRA": "BR", "BRB": "BB", "BRN": "BN",
		"BTN": "BT", "BVT": "BV", "BWA": "BW", "CAF": "CF", "CAN": "CA",
		"CCK": "CC", "CHE": "CH", "CHL": "CL", "CHN": "CN", "CIV": "CI",
		"CMR": "CM", "COD": "CD", "COG": "CG", "COK": "CK", "COL": "CO",
		"COM": "KM", "CPV": "CV", "CRI": "CR", "CUB": "CU", "CUW": "CW",
		"CXR": "CX", "CYM": "KY", "CYP": "CY", "CZE": "CZ", "DEU": "DE",
		"DJI": "DJ", "DMA": "DM", "DNK": "DK", "DOM": "DO", "DZA": "DZ",
		"ECU": "EC", "EGY": "EG", "ERI": "ER", "ESH": "EH", "ESP": "ES",
		"EST": "EE", "ETH": "ET", "FIN": "FI", "FJI": "FJ", "FLK": "FK",
		"FRA": "FR", "FRO": "FO", "FSM": "FM", "GAB": "GA", "GBR": "GB",
		"GEO": "GE", "GGY": "GG", "GHA": "GH", "GIB": "GI", "GIN": "GN",
		"GLP": "GP", "GMB": "GM", "GNB": "GW", "GNQ": "GQ", "GRC": "GR",
		"GRD": "GD", "GRL": "GL", "GTM": "GT", "GUF": "GF", "GUM": "GU",
		"GUY": "GY", "HKG": "HK", "HMD": "HM", "HND": "HN", "HRV": "HR",
		"HTI": "HT", "HUN": "HU", "IDN": "ID", "IMN": "IM", "IND": "IN",
		"IOT": "IO", "IRL": "IE", "IRN": "IR", "IRQ": "IQ", "ISL": "IS",
		"ISR": "IL", "ITA": "IT", "JAM": "JM", "JEY": "JE", "JOR": "JO",
		"JPN": "JP", "KAZ": "KZ", "KEN": "KE", "KGZ": "KG", "KHM": "KH",
		"KIR": "KI", "KNA": "KN", "KOR": "KR", "KWT": "KW", "LAO": "LA",
		"LBN": "LB", "LBR": "LR", "LBY": "LY", "LCA": "LC", "LIE": "LI",
		"LKA": "LK", "LSO": "LS", "LTU": "LT", "LUX": "LU", "LVA": "LV",
		"MAC": "MO", "MAF": "MF", "MAR": "MA", "MCO": "MC", "MDA": "MD",
		"MDG": "MG", "MDV": "MV", "MEX": "MX", "MHL": "MH", "MKD": "MK",
		"MLI": "ML", "MLT": "MT", "MMR": "MM", "MNE": "ME", "MNG": "MN",
		"MNP": "MP", "MOZ": "MZ", "MRT": "MR", "MSR": "MS", "MTQ": "MQ",
		"MUS": "MU", "MWI": "MW", "MYS": "MY", "MYT": "YT", "NAM": "NA",
		"NCL": "NC", "NER": "NE", "NFK": "NF", "NGA": "NG", "NIC": "NI",
		"NIU": "NU", "NLD": "NL", "NOR": "NO", "NPL": "NP", "NRU": "NR",
		"NZL": "NZ", "OMN": "OM", "PAK": "PK", "PAN": "PA", "PCN": "PN",
		"PER": "PE", "PHL": "PH", "PLW": "PW", "PNG": "PG", "POL": "PL",
		"PRI": "PR", "PRK": "KP", "PRT": "PT", "PRY": "PY", "PSE": "PS",
		"PYF": "PF", "QAT": "QA", "REU": "RE", "ROU": "RO", "RUS": "RU",
		"RWA": "RW", "SAU": "SA", "SDN": "SD", "SEN": "SN", "SGP": "SG",
		"SGS": "GS", "SHN": "SH", "SJM": "SJ", "SLB": "SB", "SLE": "SL",
		"SLV": "SV", "SMR": "SM", "SOM": "SO", "SPM": "PM", "SRB": "RS",
		"SSD": "SS", "STP": "ST", "SUR": "SR", "SVK": "SK", "SVN": "SI",
		"SWE": "SE", "SWZ": "SZ", "SXM": "SX", "SYC": "SC", "SYR": "SY",
		"TCA": "TC", "TCD": "TD", "TGO": "TG", "THA": "TH", "TJK": "TJ",
		"TKL": "TK", "TKM": "TM", "TLS": "TL", "TON": "TO", "TTO": "TT",
		"TUN": "TN", "TUR": "TR", "TUV": "TV", "TWN": "TW", "TZA": "TZ",
		"UGA": "UG", "UKR": "UA", "UMI": "UM", "URY": "UY", "USA": "US",
		"UZB": "UZ", "VAT": "VA", "VCT": "VC", "VEN": "VE", "VGB": "VG",
		"VIR": "VI", "VNM": "VN", "VUT": "VU", "WLF": "WF", "WSM": "WS",
		"YEM": "YE", "ZAF": "ZA", "ZMB": "ZM", "ZWE": "ZW",
	}

	for alpha3, expectedISO2 := range coverage {
		t.Run(alpha3, func(t *testing.T) {
			result := GetCountryCodeFromAlpha3(alpha3)
			assert.Equal(t, expectedISO2, result, "alpha-3 %s should map to %s", alpha3, expectedISO2)
		})
	}

	t.Run("lowercase input", func(t *testing.T) {
		assert.Equal(t, "IN", GetCountryCodeFromAlpha3("ind"))
	})

	t.Run("whitespace trimmed", func(t *testing.T) {
		assert.Equal(t, "SG", GetCountryCodeFromAlpha3("  SGP  "))
	})

	t.Run("unknown code returns empty", func(t *testing.T) {
		assert.Equal(t, "", GetCountryCodeFromAlpha3("ZZZ"))
	})

	t.Run("empty string returns empty", func(t *testing.T) {
		assert.Equal(t, "", GetCountryCodeFromAlpha3(""))
	})
}

func TestGetCountryCodeISO2(t *testing.T) {
	testCases := []struct {
		name         string
		countryName  string
		expectedCode string
	}{
		{
			name:         "Valid country name - India",
			countryName:  "India",
			expectedCode: "IN",
		},
		{
			name:         "Valid country name with different case - india",
			countryName:  "india",
			expectedCode: "IN",
		},
		{
			name:         "Valid country name with spaces - United States",
			countryName:  "United States of America (the)",
			expectedCode: "US",
		},
		{
			name:         "Valid country name with leading/trailing spaces",
			countryName:  "  India  ",
			expectedCode: "IN",
		},
		{
			name:         "Non-existent country name",
			countryName:  "NonExistentCountry",
			expectedCode: "",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := GetCountryCodeISO2(tc.countryName)
			assert.Equal(t, tc.expectedCode, result, "Country code doesn't match expected value")
		})
	}
}

func TestFormatAddressWithFormat_US(t *testing.T) {
	got, err := FormatAddressWithFormat("US", AddressComponents{
		Name:          "John Doe",
		Organization:  "Acme Corp",
		StreetAddress: "1600 Amphitheatre Pkwy",
		City:          "Mountain View",
		State:         "CA",
		Zip:           "94043",
	})
	assert.NoError(t, err)
	assert.Equal(t, "John Doe\nAcme Corp\n1600 Amphitheatre Pkwy\nMountain View, CA 94043", got)
}

func TestFormatAddressWithFormat_IN(t *testing.T) {
	got, err := FormatAddressWithFormat("IN", AddressComponents{
		Name:          "Rahul Sharma",
		Organization:  "Razorpay",
		StreetAddress: "SJR Cyber, 22, Laskar Hosur Rd",
		City:          "Bengaluru",
		Zip:           "560102",
		State:         "Karnataka",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Rahul Sharma\nRazorpay\nSJR Cyber, 22, Laskar Hosur Rd\nBengaluru 560102\nKarnataka", got)
}

func TestFormatAddressWithFormat_DE(t *testing.T) {
	got, err := FormatAddressWithFormat("DE", AddressComponents{
		Name:          "Hans Müller",
		Organization:  "Beispiel GmbH",
		StreetAddress: "Musterstraße 1",
		Zip:           "10115",
		City:          "Berlin",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Hans Müller\nBeispiel GmbH\nMusterstraße 1\n10115 Berlin", got)
}

func TestFormatAddressWithFormat_JP(t *testing.T) {
	got, err := FormatAddressWithFormat("JP", AddressComponents{
		Zip:           "100-0001",
		State:         "東京都",
		StreetAddress: "千代田1-1",
		Organization:  "株式会社テスト",
		Name:          "山田太郎",
	})
	assert.NoError(t, err)
	assert.Equal(t, "〒100-0001\n東京都\n千代田1-1\n株式会社テスト\n山田太郎", got)
}

func TestFormatAddressWithFormat_BR(t *testing.T) {
	got, err := FormatAddressWithFormat("BR", AddressComponents{
		Organization:  "Empresa Ltda",
		Name:          "João Silva",
		StreetAddress: "Rua das Flores, 123",
		District:      "Centro",
		City:          "São Paulo",
		State:         "SP",
		Zip:           "01310-100",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Empresa Ltda\nJoão Silva\nRua das Flores, 123\nCentro\nSão Paulo-SP\n01310-100", got)
}

func TestFormatAddressWithFormat_LowercaseCode(t *testing.T) {
	got, err := FormatAddressWithFormat("us", AddressComponents{
		Name:          "Jane",
		StreetAddress: "1 Main St",
		City:          "Boston",
		State:         "MA",
		Zip:           "02101",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Jane\n1 Main St\nBoston, MA 02101", got)
}

func TestFormatAddressWithFormat_WhitespacePaddedCode(t *testing.T) {
	got, err := FormatAddressWithFormat("  IN  ", AddressComponents{
		Name:          "Priya",
		StreetAddress: "12 MG Road",
		City:          "Pune",
		Zip:           "411001",
		State:         "Maharashtra",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Priya\n12 MG Road\nPune 411001\nMaharashtra", got)
}

func TestFormatAddressWithFormat_OmitOrganization(t *testing.T) {
	got, err := FormatAddressWithFormat("US", AddressComponents{
		Name:          "Jane Smith",
		StreetAddress: "742 Evergreen Terrace",
		City:          "Springfield",
		State:         "IL",
		Zip:           "62704",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Jane Smith\n742 Evergreen Terrace\nSpringfield, IL 62704", got)
}

func TestFormatAddressWithFormat_AllTokensEmpty(t *testing.T) {
	// DE: no literal separators — all lines blank
	got, err := FormatAddressWithFormat("DE", AddressComponents{})
	assert.NoError(t, err)
	assert.Equal(t, "", got)
}

func TestFormatAddressWithFormat_LiteralSeparatorKept(t *testing.T) {
	// US: "{city}, {state} {zip}" → ",  " → trims to ","
	got, err := FormatAddressWithFormat("US", AddressComponents{})
	assert.NoError(t, err)
	assert.Equal(t, ",", got)
}

func TestFormatAddressWithFormat_UnknownCode(t *testing.T) {
	_, err := FormatAddressWithFormat("ZZ", AddressComponents{Name: "Test"})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), `"ZZ"`)
}

func TestFormatAddressWithFormat_EmptyCode(t *testing.T) {
	_, err := FormatAddressWithFormat("", AddressComponents{})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "must not be empty")
}

func TestFormatAddressWithFormat_WhitespaceOnlyCode(t *testing.T) {
	_, err := FormatAddressWithFormat("   ", AddressComponents{})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "must not be empty")
}
