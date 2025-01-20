package bankcodes

import (
	"reflect"
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
