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

// loadDialCodeMap returns the dial-code → []countryCode map, loaded once.
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

// compiledRegex returns a cached *regexp.Regexp anchored as ^(?:pattern)$.
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

// cleanPhoneNumber strips all non-digit characters, preserving a leading '+'.
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

// matchesEntirely reports whether text fully matches regexPattern.
func matchesEntirely(text, regexPattern string) bool {
	re, err := compiledRegex(regexPattern)
	if err != nil {
		return false
	}
	return re.MatchString(text)
}

// detectCountryAndDialCodeFromPhone returns the best-matching (countryCode, dialCode)
// for a cleaned phone number that starts with '+'. Returns ("", "") on no match.
//
// Dial codes are evaluated in ascending numeric order (matching V8 JS key iteration),
// then per-dial-code countries are checked in JSON-preserved order — reproducing the
// same first-match priority as the JS implementation.
func detectCountryAndDialCodeFromPhone(phone string) (countryCode, dialCode string) {
	if len(phone) == 0 || phone[0] != '+' {
		return "", ""
	}

	digits := phone[1:]
	dialMap := loadDialCodeMap()

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
		cc       string
		dialCode string
	}

	var candidates []candidate
	for _, dc := range dcs {
		if strings.HasPrefix(digits, dc) {
			for _, cc := range dialMap[dc] {
				candidates = append(candidates, candidate{cc: cc, dialCode: "+" + dc})
			}
		}
	}

	for _, c := range candidates {
		numWithoutDial := strings.TrimPrefix(phone, c.dialCode)
		info := GetCountryTeleInformation(c.cc)
		if info.Regex != "" && matchesEntirely(numWithoutDial, info.Regex) {
			return c.cc, c.dialCode
		}
	}

	return "", ""
}

// getPhoneNumberWithoutDialCode returns the local subscriber number by stripping
// the detected dial code. Returns the cleaned number unchanged when no dial code is found.
func getPhoneNumberWithoutDialCode(phone string) string {
	cleaned := cleanPhoneNumber(phone)
	_, dc := detectCountryAndDialCodeFromPhone(cleaned)
	if dc == "" {
		return cleaned
	}
	return strings.TrimPrefix(cleaned, dc)
}
