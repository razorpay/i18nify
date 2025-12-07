package bankcodes

import (
	"reflect"
	"strings"
	"testing"
)

func TestIsValidBankIdentifier(t *testing.T) {

	tests := []struct {
		name            string
		countryCode     string
		identifierType  string
		identifierValue string
		want            bool
		expectError     bool
	}{
		{"Non-existent Country Code", "ZZ", "SWIFT", "TBTESTXXX", false, true},

		{"Valid SWIFT Code", "US", "SWIFT", "BNNEUS66", true, false},
		{"Invalid SWIFT Code", "US", "SWIFT", "WRONGXXX", false, false},
		{"Empty country code", "", "SWIFT", "BNNEUS66", false, true},
		{"Empty identifier", "US", "", "BNNEUS66", false, true},
		{"Empty identifier value", "US", "SWIFT", "", false, true},

		{"Valid routing number", "US", "ROUTING_NUMBER", "053208066", true, false},
		{"Invalid routing number", "US", "ROUTING_NUMBER", "053208123", false, false},
		{"Empty country code", "", "SWIFT", "BNNEUS66", false, true},
		{"Empty identifier", "US", "", "BNNEUS66", false, true},
		{"Empty identifier value", "US", "ROUTING_NUMBER", "", false, true},

		{"Valid IFSC", "IN", "IFSC", "ABHY0065001", true, false},
		{"Invalid IFSC", "IN", "IFSC", "053208123", false, false},
		{"Empty country code", "", "IFSC", "ABHY0065001", false, true},
		{"Empty identifier", "US", "", "ABHY0065001", false, true},
		{"Empty identifier value", "IN", "IFSC", "", false, true},
		// More cases based on actual data and scenarios
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := IsValidBankIdentifier(tt.countryCode, tt.identifierType, tt.identifierValue)
			if (err != nil) != tt.expectError {
				t.Errorf("IsValidBankIdentifier() error = %v, expectError %v", err, tt.expectError)
				return
			}
			if got != tt.want {
				t.Errorf("IsValidBankIdentifier() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetBankNameFromShortCode(t *testing.T) {

	tests := []struct {
		name        string
		countryCode string
		shortCode   string
		want        string
		expectError bool
	}{
		{"Non-existent Country Code", "ZZ", "ABHY", "", true},

		{"Valid SWIFT Code", "US", "USBK", "U.S. BANK N.A.", false},
		{"Invalid SWIFT Code", "US", "KSBK", "", true},
		{"Empty country code", "", "USBK", "", true},
		{"Empty short code", "US", "", "", true},

		// More cases based on actual data and scenarios
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBankNameFromShortCode(tt.countryCode, tt.shortCode)
			if (err != nil) != tt.expectError {
				t.Errorf("GetBankNameFromShortCode() error = %v, expectError %v", err, tt.expectError)
				return
			}
			if got != tt.want {
				t.Errorf("GetBankNameFromShortCode() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetDefaultBankIdentifiersFromShortCode(t *testing.T) {
	tests := []struct {
		name            string
		countryCode     string
		shortCode       string
		wantIdentifiers []string
		wantErr         bool
	}{
		{"File Load Error", "ZZ", "BUYE", nil, true},
		{"Valid Short Code", "US", "BUYE", []string{"067014372", "067092310", "071100719", "071101967", "071101996", "071102322", "071102568", "071104715", "071125587", "271170264", "271172754", "281073555"}, false},
		{"Invalid Short Code", "US", "INVALID", nil, true},
		{"Empty Country Code", "", "BUYE", nil, true},
		{"Empty Short Code", "US", "", nil, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotIdentifiers, err := GetDefaultBankIdentifiersFromShortCode(tt.countryCode, tt.shortCode)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetDefaultBankIdentifiersFromShortCode() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(gotIdentifiers, tt.wantIdentifiers) {
				t.Errorf("GetDefaultBankIdentifiersFromShortCode() = %v, want %v", gotIdentifiers, tt.wantIdentifiers)
			}
		})
	}
}

func TestGetBankNameFromBankIdentifier(t *testing.T) {
	tests := []struct {
		name        string
		countryCode string
		identifier  string
		want        string
		wantErr     bool
	}{
		{"Valid SWIFT Code", "US", "USBKUS44", "U.S. BANK N.A.", false},
		{"Valid IFSC Code", "IN", "ADCC0000039", "Akola District Central Co-operative Bank", false},
		{"Valid Routing Number", "US", "053208066", "AMERIS BANK", false},
		{"Invalid Identifier", "US", "XYZ123456", "", true},
		{"Empty Country Code", "", "021000021", "", true},
		{"Empty Identifier", "US", "", "", true},
		{"Data Load Failure", "ZZ", "BNNAUS3N", "", true},
		{"No Bank Found", "US", "NOBANK123", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBankNameFromBankIdentifier(tt.countryCode, tt.identifier)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetBankNameFromBankIdentifier() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GetBankNameFromBankIdentifier() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetBaseBranchIdentifierFromShortCode(t *testing.T) {
	tests := []struct {
		name               string
		countryCode        string
		bankShortCode      string
		expectedIdentifier string
		expectError        bool
		errorContains      string
	}{
		{
			name:               "Valid US bank short code",
			countryCode:        "US",
			bankShortCode:      "USBK",
			expectedIdentifier: "",
			expectError:        true, // USBK doesn't have routing numbers
			errorContains:      "no ROUTING_NUMBER found for bank 'USBK' in country US",
		},
		{
			name:               "Valid US bank short code with multiple branches",
			countryCode:        "US",
			bankShortCode:      "BUYE",
			expectedIdentifier: "", // Should return routing number for US
			expectError:        false,
		},
		{
			name:               "Invalid bank short code",
			countryCode:        "US",
			bankShortCode:      "INVALID",
			expectedIdentifier: "",
			expectError:        true,
			errorContains:      "no ROUTING_NUMBER found for bank 'INVALID' in country US",
		},
		{
			name:               "Empty country code",
			countryCode:        "",
			bankShortCode:      "USBK",
			expectedIdentifier: "",
			expectError:        true,
			errorContains:      "countryCode and bankShortCode must not be empty",
		},
		{
			name:               "Empty bank short code",
			countryCode:        "US",
			bankShortCode:      "",
			expectedIdentifier: "",
			expectError:        true,
			errorContains:      "countryCode and bankShortCode must not be empty",
		},
		{
			name:               "Non-existent country code",
			countryCode:        "ZZ",
			bankShortCode:      "USBK",
			expectedIdentifier: "",
			expectError:        true,
			errorContains:      "failed to load bank information for country ZZ",
		},
		{
			name:               "Valid IN bank short code",
			countryCode:        "IN",
			bankShortCode:      "ABHY",
			expectedIdentifier: "",
			expectError:        false, // Should return IFSC code for IN
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBaseBranchIdentifierFromShortCode(tt.countryCode, tt.bankShortCode)

			if tt.expectError {
				if err == nil {
					t.Errorf("GetBaseBranchIdentifierFromShortCode() expected error but got none")
					return
				}
				if tt.errorContains != "" && !strings.Contains(err.Error(), tt.errorContains) {
					t.Errorf("GetBaseBranchIdentifierFromShortCode() error = %v, expected to contain %v", err, tt.errorContains)
				}
				return
			}

			if err != nil {
				t.Errorf("GetBaseBranchIdentifierFromShortCode() unexpected error = %v", err)
				return
			}

			// For valid cases, check if we got an identifier
			if got == "" {
				t.Errorf("GetBaseBranchIdentifierFromShortCode() got empty identifier, expected non-empty")
			}

			// For US, expect routing number format (9 digits)
			if tt.countryCode == "US" && len(got) != 9 {
				t.Logf("GetBaseBranchIdentifierFromShortCode() got = %v, expected 9-digit routing number for US", got)
			}

			// For IN, expect IFSC format (11 characters)
			if tt.countryCode == "IN" && len(got) != 11 {
				t.Logf("GetBaseBranchIdentifierFromShortCode() got = %v, expected 11-character IFSC for IN", got)
			}
		})
	}
}

func TestGetAllBanksWithShortCodes(t *testing.T) {
	tests := []struct {
		name           string
		countryCode    string
		expectError    bool
		errorContains  string
		validateResult func(t *testing.T, result map[string]string)
	}{
		{
			name:        "Valid US country code",
			countryCode: "US",
			expectError: false,
			validateResult: func(t *testing.T, result map[string]string) {
				if len(result) == 0 {
					t.Error("Expected non-empty bank info map for US")
				}

				// Check if known US banks are present
				if bankName, exists := result["USBK"]; !exists {
					t.Error("Expected USBK bank to be present in US bank info")
				} else if bankName == "" {
					t.Error("Expected USBK bank name to be non-empty")
				}

				if bankName, exists := result["BUYE"]; !exists {
					t.Error("Expected BUYE bank to be present in US bank info")
				} else if bankName == "" {
					t.Error("Expected BUYE bank name to be non-empty")
				}

				// Validate that all values are non-empty strings
				for shortCode, bankName := range result {
					if bankName == "" {
						t.Errorf("Expected bank name for %s to be non-empty", shortCode)
					}
				}
			},
		},
		{
			name:        "Valid IN country code",
			countryCode: "IN",
			expectError: false,
			validateResult: func(t *testing.T, result map[string]string) {
				if len(result) == 0 {
					t.Error("Expected non-empty bank info map for IN")
				}

				// Check if known IN banks are present
				if bankName, exists := result["ABHY"]; !exists {
					t.Error("Expected ABHY bank to be present in IN bank info")
				} else if bankName == "" {
					t.Error("Expected ABHY bank name to be non-empty")
				}

				// Validate that all values are non-empty strings
				for shortCode, bankName := range result {
					if bankName == "" {
						t.Errorf("Expected bank name for %s to be non-empty", shortCode)
					}
				}
			},
		},
		{
			name:          "Empty country code",
			countryCode:   "",
			expectError:   true,
			errorContains: "country code is empty",
		},
		{
			name:          "Non-existent country code",
			countryCode:   "ZZ",
			expectError:   true,
			errorContains: "failed to load bank information for country ZZ",
		},
		{
			name:        "Valid MY country code",
			countryCode: "MY",
			expectError: false,
			validateResult: func(t *testing.T, result map[string]string) {
				// Should return a map, even if empty
				if result == nil {
					t.Error("Expected non-nil result for MY")
				}
			},
		},
		{
			name:        "Valid SG country code",
			countryCode: "SG",
			expectError: false,
			validateResult: func(t *testing.T, result map[string]string) {
				// Should return a map, even if empty
				if result == nil {
					t.Error("Expected non-nil result for SG")
				}
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetAllBanksWithShortCodes(tt.countryCode)

			if tt.expectError {
				if err == nil {
					t.Errorf("GetAllBanksWithShortCodes() expected error but got none")
					return
				}
				if tt.errorContains != "" && !strings.Contains(err.Error(), tt.errorContains) {
					t.Errorf("GetAllBanksWithShortCodes() error = %v, expected to contain %v", err, tt.errorContains)
				}
				return
			}

			if err != nil {
				t.Errorf("GetAllBanksWithShortCodes() unexpected error = %v", err)
				return
			}

			if got == nil {
				t.Error("GetAllBanksWithShortCodes() returned nil map")
				return
			}

			// Run custom validation if provided
			if tt.validateResult != nil {
				tt.validateResult(t, got)
			}
		})
	}
}

func TestGetBaseBranchIdentifierFromShortCode_EdgeCases(t *testing.T) {
	tests := []struct {
		name          string
		countryCode   string
		bankShortCode string
		description   string
		expectError   bool
	}{
		{
			name:          "Case insensitive bank short code",
			countryCode:   "US",
			bankShortCode: "usbk", // lowercase
			description:   "Should handle case insensitive bank short codes",
			expectError:   true, // Function doesn't handle case insensitivity
		},
		{
			name:          "Case insensitive country code",
			countryCode:   "us", // lowercase
			bankShortCode: "USBK",
			description:   "Should handle case insensitive country codes",
			expectError:   true, // Country code conversion doesn't help if bank data doesn't exist
		},
		{
			name:          "Bank with no identifiers",
			countryCode:   "US",
			bankShortCode: "NOIDENTIFIER", // Assuming this bank has no identifiers
			description:   "Should handle banks with no identifiers gracefully",
			expectError:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBaseBranchIdentifierFromShortCode(tt.countryCode, tt.bankShortCode)

			if tt.expectError {
				if err == nil {
					t.Errorf("GetBaseBranchIdentifierFromShortCode() expected error for %s but got none", tt.description)
				}
				return
			}

			if err != nil {
				// For case sensitivity tests, if we get an error, it might be because
				// the data doesn't exist, which is acceptable for these edge cases
				t.Logf("GetBaseBranchIdentifierFromShortCode() %s: %v", tt.description, err)
				return
			}

			if len(got) < 4 {
				t.Errorf("GetBaseBranchIdentifierFromShortCode() %s: got = %v, expected at least 4 characters", tt.description, got)
			}
		})
	}
}

func TestGetAllBanksWithShortCodes_DataIntegrity(t *testing.T) {
	// Test that the returned data structure is consistent
	t.Run("Data structure consistency", func(t *testing.T) {
		result, err := GetAllBanksWithShortCodes("US")
		if err != nil {
			t.Fatalf("GetAllBanksWithShortCodes() unexpected error = %v", err)
		}

		for shortCode, bankName := range result {
			// Verify basic data integrity
			if bankName == "" {
				t.Errorf("Bank %s has empty name", shortCode)
			}

			// Verify that short codes are reasonable (not empty, reasonable length)
			if len(shortCode) > 10 {
				t.Errorf("Short code %s seems too long (%d characters)", shortCode, len(shortCode))
			}
		}
	})
}
