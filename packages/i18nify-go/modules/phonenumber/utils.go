package phonenumber

import (
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"

	dialDataSource "github.com/razorpay/i18nify/i18nify-data/go/phone-number/dial-code-to-country"
)

var (
	dialCodeMapCache map[string][]string
	dialCodeMapOnce  sync.Once

	regexCache   = make(map[string]*regexp.Regexp)
	regexCacheMu sync.RWMutex
)

// loadDialCodeMap returns the dial-code → []countryCode map once, caching the result.
// The per-dial-code slice order is preserved from JSON, mirroring the JS DIAL_CODE_MAPPER.
func loadDialCodeMap() map[string][]string {
	dialCodeMapOnce.Do(func() {
		m, err := dialDataSource.GetDialCodeToCountryData()
		if err != nil {
			dialCodeMapCache = make(map[string][]string)
			return
		}
		dialCodeMapCache = m
	})
	return dialCodeMapCache
}

// compiledRegex returns a cached *regexp.Regexp for the given pattern,
// anchored as ^(?:pattern)$ to match the full string.
func compiledRegex(pattern string) (*regexp.Regexp, error) {
	anchored := `^(?:` + pattern + `)$`

	regexCacheMu.RLock()
	re, ok := regexCache[anchored]
	regexCacheMu.RUnlock()
	if ok {
		return re, nil
	}

	re, err := regexp.Compile(anchored)
	if err != nil {
		return nil, err
	}
	regexCacheMu.Lock()
	regexCache[anchored] = re
	regexCacheMu.Unlock()
	return re, nil
}

// cleanPhoneNumber removes every character that is not a digit, preserving a
// single leading '+'. Mirrors the JS cleanPhoneNumber utility exactly:
//
//	const regex = /[^0-9+]|(?!A)\+/g;
//	return phone[0] === '+' ? `+${cleaned}` : cleaned;
func cleanPhoneNumber(phone string) string {
	if phone == "" {
		return ""
	}
	startsWithPlus := phone[0] == '+'
	var b strings.Builder
	for _, r := range phone {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}
	if startsWithPlus {
		return "+" + b.String()
	}
	return b.String()
}

// matchesEntirely tests whether text matches regexPattern anchored to the full string.
// Mirrors the JS matchesEntirely utility:
//
//	new RegExp('^(?:' + pattern + ')$').test(text)
func matchesEntirely(text, regexPattern string) bool {
	re, err := compiledRegex(regexPattern)
	if err != nil {
		return false
	}
	return re.MatchString(text)
}

// detectCountryAndDialCodeFromPhone identifies the best-matching country and its
// dial code for a cleaned phone number. Returns ("", "") when:
//   - the number has no leading '+', or
//   - no regex-verified match is found.
//
// Candidates are collected by iterating dial codes in ascending numeric order
// (matching V8 JS engine's integer-key iteration) and then searched in the
// per-dial-code array order preserved from the JSON source. This reproduces the
// same first-match priority as the JS detectCountryAndDialCodeFromPhone utility.
func detectCountryAndDialCodeFromPhone(phone string) (countryCode, dialCode string) {
	if len(phone) == 0 || phone[0] != '+' {
		return "", ""
	}

	digits := phone[1:] // strip leading '+'

	dialMap := loadDialCodeMap()

	// Collect all dial code keys and sort them numerically ascending.
	dcs := make([]string, 0, len(dialMap))
	for dc := range dialMap {
		dcs = append(dcs, dc)
	}
	sort.Slice(dcs, func(i, j int) bool {
		ni, ei := strconv.Atoi(dcs[i])
		nj, ej := strconv.Atoi(dcs[j])
		if ei == nil && ej == nil {
			return ni < nj
		}
		return dcs[i] < dcs[j]
	})

	type candidate struct {
		cc      string
		dialCode string
	}

	// Build ordered candidate list: for each matching dial code (in numeric order),
	// add countries in the JSON-preserved slice order.
	var candidates []candidate
	for _, dc := range dcs {
		if strings.HasPrefix(digits, dc) {
			for _, cc := range dialMap[dc] {
				candidates = append(candidates, candidate{cc: cc, dialCode: "+" + dc})
			}
		}
	}

	// Return the first candidate whose regex validates the number without the dial code.
	for _, c := range candidates {
		numWithoutDial := strings.TrimPrefix(phone, c.dialCode)
		info := GetCountryTeleInformation(c.cc)
		if info.Regex != "" && matchesEntirely(numWithoutDial, info.Regex) {
			return c.cc, c.dialCode
		}
	}

	return "", ""
}

// getPhoneNumberWithoutDialCode strips the detected dial code from phone and
// returns the local subscriber number. Returns the cleaned number unchanged
// when no dial code is detected. Mirrors the JS utility of the same name.
func getPhoneNumberWithoutDialCode(phone string) string {
	cleaned := cleanPhoneNumber(phone)
	_, dc := detectCountryAndDialCodeFromPhone(cleaned)
	if dc == "" {
		return cleaned
	}
	return strings.TrimPrefix(cleaned, dc)
}
