package country_metadata

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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

func TestGetMetadataInformation_LocaleDateConfig(t *testing.T) {
	result := GetMetadataInformation("CA")

	enCA := result.Locales["en_CA"]
	assert.Equal(t, "MDY", enCA.DateOrder)
	assert.Equal(t, "/", enCA.DateSeparator)

	frCA := result.Locales["fr_CA"]
	assert.Equal(t, "DMY", frCA.DateOrder)
	assert.Equal(t, "-", frCA.DateSeparator)
}

func TestGetLocaleByIdentifier(t *testing.T) {
	enCA, ok := getLocaleByIdentifier("en-CA")
	assert.True(t, ok)
	assert.Equal(t, "English (Canada)", enCA.Name)
	assert.Equal(t, "MDY", enCA.DateOrder)
	assert.Equal(t, "/", enCA.DateSeparator)

	fr, ok := getLocaleByIdentifier("fr")
	assert.True(t, ok)
	assert.Equal(t, "French", fr.Name)

	_, ok = getLocaleByIdentifier("")
	assert.False(t, ok)
}

func TestGetSupportedDateFormats(t *testing.T) {
	jsonData := []byte(`{"metadata_information":{"IN":{"country_name":"India","continent_code":"AS","continent_name":"Asia","alpha_3":"IND","numeric_code":"356","flag":"https://flagcdn.com/in.svg","sovereignty":"UN member state","dial_code":"+91","supported_currency":["INR"],"timezones":{"Asia/Kolkata":{"utc_offset":"UTC +05:30"}},"timezone_of_capital":"Asia/Kolkata","locales":{"en_IN":{"name":"English (India)"}},"default_locale":"en_IN","default_currency":"INR"}},"supported_date_formats":[{"regex":"^(\\d{4})/(0[1-9]|1[0-2])/(\\d{2})$","year_index":1,"month_index":2,"day_index":3,"format":"YYYY/MM/DD"}]}`)
	countryMetadata, err := UnmarshalCountryMetadata(jsonData)
	assert.NoError(t, err)
	assert.Len(t, countryMetadata.SupportedDateFormats, 1)
	assert.Equal(t, "YYYY/MM/DD", countryMetadata.SupportedDateFormats[0].Format)
	assert.Equal(t, int32(1), countryMetadata.SupportedDateFormats[0].YearIndex)

	actual := cachedCountyMetaData.GetSupportedDateFormats()
	assert.NotEmpty(t, actual)
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

// ─── FormatDateTime ───────────────────────────────────────────────────────────

func TestFormatDateTime_DateOnly_enUS(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "3/5/2024", got)
}

func TestFormatDateTime_DateOnly_enGB(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-GB",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "5/3/2024", got)
}

func TestFormatDateTime_DateOnly_frCAUsesCountryMetadata(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "fr-CA",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "5-3-2024", got)
}

func TestFormatDateTime_DateOnly_Japanese(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "ja",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "2024/3/5", got)
}

func TestFormatDateTime_TimeOnly_24h(t *testing.T) {
	ts := time.Date(2024, 1, 1, 14, 5, 9, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeTimeOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "2:5:9 PM", got)
}

func TestFormatDateTime_TimeOnly_12h(t *testing.T) {
	h12 := true
	ts := time.Date(2024, 1, 1, 14, 5, 9, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeTimeOnly,
		Hour12:       &h12,
	})
	require.NoError(t, err)
	assert.Equal(t, "2:5:9 PM", got)
}

func TestFormatDateTime_DateTime(t *testing.T) {
	ts := time.Date(2024, 3, 5, 14, 30, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeDateTime,
	})
	require.NoError(t, err)
	assert.Equal(t, "3/5/2024 2:30:0 PM", got)
}

func TestFormatDateTime_LongMonth(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale: "en-US",
		Year:   StyleNumeric,
		Month:  StyleLong,
		Day:    StyleNumeric,
	})
	require.NoError(t, err)
	assert.Equal(t, "March/5/2024", got)
}

func TestFormatDateTime_TwoDigitYear(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale: "en-US",
		Year:   Style2Digit,
		Month:  Style2Digit,
		Day:    Style2Digit,
	})
	require.NoError(t, err)
	assert.Equal(t, "03/05/24", got)
}

func TestFormatDateTime_NoComponents_Error(t *testing.T) {
	ts := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	_, err := FormatDateTime(ts, FormatDateTimeOptions{})
	require.Error(t, err)
}

func TestFormatDateTime_DefaultLocale(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	// Default locale is "en-IN" → DMY
	assert.Equal(t, "5/3/2024", got)
}

// ─── GetRelativeTime ──────────────────────────────────────────────────────────

func TestGetRelativeTime_SecondsAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	past := base.Add(-30 * time.Second)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "30 seconds ago", got)
}

func TestGetRelativeTime_MinutesAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	past := base.Add(-5 * time.Minute)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "5 minutes ago", got)
}

func TestGetRelativeTime_HoursAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	past := base.Add(-3 * time.Hour)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "3 hours ago", got)
}

func TestGetRelativeTime_Yesterday_Auto(t *testing.T) {
	base := time.Date(2024, 1, 2, 12, 0, 0, 0, time.UTC)
	past := base.Add(-24 * time.Hour)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base})
	require.NoError(t, err)
	assert.Equal(t, "yesterday", got)
}

func TestGetRelativeTime_Tomorrow_Auto(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	future := base.Add(24 * time.Hour)
	got, err := GetRelativeTime(future, GetRelativeTimeOptions{BaseDate: base})
	require.NoError(t, err)
	assert.Equal(t, "tomorrow", got)
}

func TestGetRelativeTime_LastWeek_Auto(t *testing.T) {
	base := time.Date(2024, 1, 8, 0, 0, 0, 0, time.UTC)
	past := base.Add(-7 * 24 * time.Hour)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base})
	require.NoError(t, err)
	assert.Equal(t, "last week", got)
}

func TestGetRelativeTime_InFuture(t *testing.T) {
	base := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	future := base.Add(2 * time.Hour)
	got, err := GetRelativeTime(future, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "in 2 hours", got)
}

func TestGetRelativeTime_YearsAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	past := base.AddDate(-3, 0, 0)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "3 years ago", got)
}

// ─── GetWeekdays ──────────────────────────────────────────────────────────────

func TestGetWeekdays_Long(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayLong})
	require.NoError(t, err)
	assert.Len(t, days, 7)
	assert.Equal(t, "Sunday", days[0])
	assert.Equal(t, "Saturday", days[6])
}

func TestGetWeekdays_Short(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayShort})
	require.NoError(t, err)
	assert.Equal(t, []string{"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}, days)
}

func TestGetWeekdays_Narrow(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayNarrow})
	require.NoError(t, err)
	assert.Equal(t, []string{"S", "M", "T", "W", "T", "F", "S"}, days)
}

func TestGetWeekdays_DefaultStyle(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{})
	require.NoError(t, err)
	assert.Equal(t, "Sunday", days[0], "default style should be long")
}

func TestGetWeekdays_InvalidStyle(t *testing.T) {
	_, err := GetWeekdays(GetWeekdaysOptions{Weekday: "invalid"})
	require.Error(t, err)
}

func TestGetWeekdays_StartsOnSunday(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayLong})
	require.NoError(t, err)
	assert.Equal(t, "Sunday", days[0], "first element must be Sunday to match JS behaviour")
}

// ─── GetTimeZoneByCountry ─────────────────────────────────────────────────────

func TestGetTimeZoneByCountry_India(t *testing.T) {
	tzs, err := GetTimeZoneByCountry("IN")
	require.NoError(t, err)
	require.NotEmpty(t, tzs)

	// India has a single timezone.
	tz, ok := tzs["Asia/Kolkata"]
	require.True(t, ok, "expected Asia/Kolkata in result")
	assert.Equal(t, "UTC +05:30", tz.UTCOffset)
}

func TestGetTimeZoneByCountry_CaseInsensitive(t *testing.T) {
	tzs1, err1 := GetTimeZoneByCountry("IN")
	tzs2, err2 := GetTimeZoneByCountry("in")
	require.NoError(t, err1)
	require.NoError(t, err2)
	assert.Equal(t, tzs1, tzs2)
}

func TestGetTimeZoneByCountry_EmptyCode(t *testing.T) {
	_, err := GetTimeZoneByCountry("")
	require.Error(t, err)
}

func TestGetTimeZoneByCountry_UnknownCode(t *testing.T) {
	_, err := GetTimeZoneByCountry("ZZ")
	require.Error(t, err)
}

func TestGetTimeZoneByCountry_MultipleTimezones(t *testing.T) {
	// The US observes multiple timezones.
	tzs, err := GetTimeZoneByCountry("US")
	require.NoError(t, err)
	assert.Greater(t, len(tzs), 1, "US should have multiple timezone entries")
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

func TestGetDefaultLocaleList(t *testing.T) {
	got, err := GetDefaultLocaleList()
	require.NoError(t, err)

	assert.NotEmpty(t, got)
	assert.Equal(t, "en_IN", got["IN"])
	assert.Equal(t, "en_US", got["US"])
	assert.Equal(t, "de", got["DE"])

	for countryCode, locale := range got {
		assert.NotEmpty(t, countryCode)
		assert.NotEmpty(t, locale)
	}
}

func TestGetDefaultLocaleList_SkipsCountriesWithoutDefaultLocale(t *testing.T) {
	setCachedCountyMetaDataForTest(t, &CountryMetadata{
		MetadataInformation: map[string]MetadataInformation{
			"AA": {DefaultLocale: "aa_AA"},
			"BB": {DefaultLocale: ""},
			"DD": {DefaultLocale: "dd_DD"},
		},
	})

	got, err := GetDefaultLocaleList()
	require.NoError(t, err)

	assert.Equal(t, map[string]string{
		"AA": "aa_AA",
		"DD": "dd_DD",
	}, got)
}

func TestGetDefaultLocaleList_MetadataNotLoaded(t *testing.T) {
	setCachedCountyMetaDataForTest(t, nil)

	got, err := GetDefaultLocaleList()
	require.Error(t, err)

	assert.Nil(t, got)
	assert.Contains(t, err.Error(), "country metadata not loaded")
}

func TestGetDefaultLocaleList_NoDefaultLocales(t *testing.T) {
	setCachedCountyMetaDataForTest(t, &CountryMetadata{
		MetadataInformation: map[string]MetadataInformation{
			"AA": {DefaultLocale: ""},
		},
	})

	got, err := GetDefaultLocaleList()
	require.Error(t, err)

	assert.Nil(t, got)
	assert.Contains(t, err.Error(), "no default locales found")
}

func setCachedCountyMetaDataForTest(t *testing.T, metadata *CountryMetadata) {
	t.Helper()

	original := cachedCountyMetaData
	cachedCountyMetaData = metadata
	t.Cleanup(func() {
		cachedCountyMetaData = original
	})
}
