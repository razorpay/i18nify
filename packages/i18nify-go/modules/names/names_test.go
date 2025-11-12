package names

import (
	"testing"
)

// TestValidateNames validates names from multiple linguistic and cultural contexts.
func TestValidateNames(t *testing.T) {
	testCases := []struct {
		name     string
		isValid  bool
		category string
	}{

		// Cantonese
		{"陳小明", true, "Cantonese"},
		{"鄭嘉穎", true, "Cantonese"},
		{"何詠姍@", false, "Cantonese"}, // Invalid character
		{"梁朝偉", true, "Cantonese"},

		// Korean
		{"김철수", true, "Korean"},
		{"박지민", true, "Korean"},
		{"최윤아@", false, "Korean"}, // Invalid character
		{"이승기", true, "Korean"},
		{"조영남;", false, "Korean"}, // Injection

		// Malay
		{"Ahmad bin Abdullah", true, "Malay"},
		{"Siti binti Hassan", true, "Malay"},
		{"Haji Osman@", false, "Malay"},        // Invalid character
		{"  Ahmad bin Osman  ", true, "Malay"}, // Leading/trailing spaces

		// Indonesian
		{"Sukarno", true, "Indonesian"},
		{"Ahmad bin Yusuf", true, "Indonesian"},
		{"Fatimah binti Hasan@", false, "Indonesian"}, // Invalid character
		{"Raden Adjeng Kartini", true, "Indonesian"},

		// German
		{"Hans Müller", true, "German"},
		{"Jürgen Schäfer", true, "German"},
		{"Johann@Goethe", false, "German"},  // Invalid character
		{"Franziska-Meier", true, "German"}, // Hyphenated

		// Swiss
		{"Urs Bühler", true, "Swiss"},
		{"Hans-Rudolf Meier", true, "Swiss"},
		{"Émile@Zola", false, "Swiss"}, // Invalid character
		{"Heidi Kuster", true, "Swiss"},

		// American
		{"John Smith", true, "American"},
		{"Mary-Jane", true, "American"}, // Hyphenated
		{"O'Connor", true, "American"},  // Apostrophe
		{"John123", false, "American"},  // Numbers not allowed

		// Latin American
		{"José Martínez", true, "Latin American"},
		{"Juan Carlos", true, "Latin American"},
		{"María123", false, "Latin American"},    // Numbers not allowed
		{"Miguel Ángel", true, "Latin American"}, // Space with special character

		// Canadian
		{"Liam O'Brien", true, "Canadian"},
		{"Emma-Jane", true, "Canadian"},  // Hyphenated
		{"Pierre123", false, "Canadian"}, // Numbers not allowed
		{"Charlotte-Dupont", true, "Canadian"},
	}

	for _, testCase := range testCases {
		t.Run(testCase.category+"_"+testCase.name, func(t *testing.T) {
			// Validate name directly, no error handling
			valid := ValidateName(testCase.name)
			if valid != testCase.isValid {
				t.Errorf("Expected validity of %v for name %q in category %q but got %v", testCase.isValid, testCase.name, testCase.category, valid)
			}
		})
	}
}
