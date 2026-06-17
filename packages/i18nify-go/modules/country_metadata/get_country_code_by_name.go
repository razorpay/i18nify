package country_metadata

import (
	"fmt"
	"regexp"
	"strings"
)

// annotationRE matches a trailing parenthesized or bracketed annotation,
// e.g. " (the)", " [Malvinas]", " (the Republic of)".
var annotationRE = regexp.MustCompile(`\s*(?:\([^)]*\)|\[[^\]]*\])\s*$`)

// countryAliases maps lowercase common English names to ISO 3166-1 alpha-2 codes.
// Aliases take precedence over stripped forms and override exact ISO names.
var countryAliases = map[string]string{
	"united states":                  "US",
	"usa":                            "US",
	"u.s.a.":                         "US",
	"u.s.":                           "US",
	"united kingdom":                 "GB",
	"uk":                             "GB",
	"great britain":                  "GB",
	"russia":                         "RU",
	"south korea":                    "KR",
	"north korea":                    "KP",
	"vietnam":                        "VN",
	"laos":                           "LA",
	"tanzania":                       "TZ",
	"ivory coast":                    "CI",
	"cote d'ivoire":                  "CI",
	"dr congo":                       "CD",
	"democratic republic of congo":   "CD",
	"drc":                            "CD",
	"republic of congo":              "CG",
	"turkey":                         "TR",
	"brunei":                         "BN",
	"east timor":                     "TL",
	"swaziland":                      "SZ",
	"cape verde":                     "CV",
	"czech republic":                 "CZ",
	"vatican":                        "VA",
	"vatican city":                   "VA",
	"macau":                          "MO",
	"burma":                          "MM",
	"palestine":                      "PS",
	"syria":                          "SY",
	"netherlands":                    "NL",
	"uae":                            "AE",
	"bolivia (plurinational state of)": "BO",
}

// countryNameLookup is a combined case-insensitive map built at init time from:
// 1. exact ISO 3166-1 country names from the cached metadata
// 2. non-ambiguous stripped forms (trailing annotations removed)
// 3. explicit aliases from countryAliases (highest precedence)
var countryNameLookup map[string]string

func init() {
	buildCountryNameLookup()
}

func buildCountryNameLookup() {
	if cachedCountyMetaData == nil {
		return
	}

	lookup := make(map[string]string, 350)

	// Pass 1: exact ISO names (lowercase).
	for code, info := range cachedCountyMetaData.MetadataInformation {
		key := strings.ToLower(strings.TrimSpace(info.CountryName))
		lookup[key] = code
	}

	// Pass 2: stripped forms — but only when exactly one country strips to that form.
	// Collect all stripped → [codes] mappings first to detect collisions.
	strippedCodes := make(map[string][]string)
	for code, info := range cachedCountyMetaData.MetadataInformation {
		orig := strings.ToLower(strings.TrimSpace(info.CountryName))
		stripped := stripAnnotations(orig)
		if stripped != orig {
			strippedCodes[stripped] = append(strippedCodes[stripped], code)
		}
	}
	for stripped, codes := range strippedCodes {
		if len(codes) == 1 {
			lookup[stripped] = codes[0]
		}
		// Ambiguous stripped forms (e.g. "congo" → CD or CG, "korea" → KP or KR,
		// "virgin islands" → VG or VI) are intentionally excluded.
	}

	// Pass 3: aliases override everything — they are authoritative for common names.
	for alias, code := range countryAliases {
		lookup[alias] = code
	}

	countryNameLookup = lookup
}

// stripAnnotations removes trailing parenthesized and bracketed annotations
// iteratively until no more are found.
// Examples:
//
//	"Falkland Islands (the) [Malvinas]" → "Falkland Islands"
//	"Iran (Islamic Republic of)"        → "Iran"
//	"France [m]"                        → "France"
func stripAnnotations(s string) string {
	for {
		next := strings.TrimSpace(annotationRE.ReplaceAllString(s, ""))
		if next == s {
			return s
		}
		s = next
	}
}

// GetCountryCodeByName returns the ISO 3166-1 alpha-2 code for the given country
// name. It accepts official ISO 3166-1 English names, non-ambiguous stripped forms
// (e.g. "Bahamas" for "Bahamas (the)"), and common English aliases (e.g. "Russia",
// "United States", "South Korea"). Lookup is case-insensitive.
// Returns an error when the name is empty or not found in the lookup.
func GetCountryCodeByName(name string) (string, error) {
	if strings.TrimSpace(name) == "" {
		return "", fmt.Errorf("getCountryCodeByName: country name must not be empty")
	}

	key := strings.ToLower(strings.TrimSpace(name))
	if code, ok := countryNameLookup[key]; ok {
		return code, nil
	}

	return "", fmt.Errorf(
		`getCountryCodeByName: %q is not a recognised country name; use an ISO 3166-1 English name or a common alias (e.g. "India", "United States", "Germany")`,
		name,
	)
}
