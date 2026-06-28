package names

import (
	"fmt"
	"strings"
	"unicode"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/names"
)

const (
	defaultSequentialThreshold     = 4
	defaultRepeatingThreshold      = 3
	defaultAlphaDominanceThreshold = 0.5
)

// defaultBlocklist contains common placeholder, test, and garbage name values.
var defaultBlocklist = []string{
	"test", "testing", "tester", "asdf", "asdfgh", "qwerty", "qwertyui", "qwer",
	"zxcv", "zxcvbn", "null", "undefined", "none", "na", "n/a", "nil", "void",
	"admin", "user", "noreply", "no-reply", "anonymous", "anon", "root", "guest",
	"system", "support", "contact", "name", "fullname", "firstname", "lastname",
	"your name", "enter name", "enter your name", "placeholder", "sample",
	"example", "demo", "dummy", "fake", "abc", "abcd", "abcde", "xyz", "xyzabc",
	"aaa", "bbb", "ccc", "xxx", "yyy", "zzz", "123", "1234", "12345",
	"aaaa", "bbbb", "cccc", "password", "pass", "login", "default",
}

type nameValidationConfig struct {
	sequentialThreshold     int
	repeatingThreshold      int
	alphaDominanceThreshold float64
	blocklist               []string
}

func resolveNameValidationConfig(opts *IsValidNameOptions) nameValidationConfig {
	config := nameValidationConfig{
		sequentialThreshold:     defaultSequentialThreshold,
		repeatingThreshold:      defaultRepeatingThreshold,
		alphaDominanceThreshold: defaultAlphaDominanceThreshold,
		blocklist:               defaultBlocklist,
	}

	if opts == nil {
		return config
	}

	if opts.SequentialThreshold > 0 {
		config.sequentialThreshold = opts.SequentialThreshold
	}
	if opts.RepeatingThreshold > 0 {
		config.repeatingThreshold = opts.RepeatingThreshold
	}
	if opts.AlphaDominanceThreshold > 0 {
		config.alphaDominanceThreshold = opts.AlphaDominanceThreshold
	}
	if opts.Blocklist != nil {
		if opts.AllowBlocklistExtension {
			config.blocklist = append(append([]string{}, defaultBlocklist...), opts.Blocklist...)
		} else {
			config.blocklist = opts.Blocklist
		}
	}

	return config
}

func loadNamesInformation(operation string) (*dataSource.NamesInformation, error) {
	data, err := dataSource.GetNamesData()
	if err != nil {
		return nil, fmt.Errorf("names: %s: failed to load names data: %w", operation, err)
	}

	info := data.GetNamesInformation()
	if info == nil {
		return nil, fmt.Errorf("names: %s: names data is missing names_information", operation)
	}

	return info, nil
}

func loadNameValidationRules(operation string) (*dataSource.ValidationRules, error) {
	info, err := loadNamesInformation(operation)
	if err != nil {
		return nil, err
	}

	rules := info.GetValidationRules()
	if rules == nil {
		return nil, fmt.Errorf("names: %s: names data is missing validation_rules", operation)
	}

	return rules, nil
}

func isBlocklisted(value string, blocklist []string) bool {
	for _, entry := range blocklist {
		if strings.EqualFold(value, entry) {
			return true
		}
	}
	return false
}

func hasSequentialChars(value string, threshold int) bool {
	runes := make([]rune, 0, len([]rune(value)))
	for _, r := range value {
		if unicode.IsSpace(r) {
			continue
		}
		runes = append(runes, r)
	}

	if len(runes) < threshold {
		return false
	}

	ascendingRun := 1
	descendingRun := 1

	for i := 1; i < len(runes); i++ {
		diff := int(runes[i]) - int(runes[i-1])
		if diff == 1 {
			ascendingRun++
			if ascendingRun >= threshold {
				return true
			}
		} else {
			ascendingRun = 1
		}

		if diff == -1 {
			descendingRun++
			if descendingRun >= threshold {
				return true
			}
		} else {
			descendingRun = 1
		}
	}

	return false
}

func hasRepeatingChars(value string, threshold int) bool {
	runes := []rune(value)
	if len(runes) < threshold {
		return false
	}

	run := 1

	for i := 1; i < len(runes); i++ {
		if runes[i] == runes[i-1] {
			run++
			if run >= threshold {
				return true
			}
		} else {
			run = 1
		}
	}

	return false
}

func isAlphaDominant(value string, threshold float64) bool {
	nonWhitespaceCount := 0
	letterCount := 0

	for _, r := range value {
		if unicode.IsSpace(r) {
			continue
		}

		nonWhitespaceCount++
		if unicode.IsLetter(r) {
			letterCount++
		}
	}

	if nonWhitespaceCount == 0 {
		return false
	}

	return float64(letterCount)/float64(nonWhitespaceCount) >= threshold
}
