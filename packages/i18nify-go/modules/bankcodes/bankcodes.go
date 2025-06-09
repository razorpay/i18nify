package bankcodes

import (
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

//go:embed data
var bankJsonDir embed.FS

// DataFile defines the path to the JSON data file containing bank information.
const DataFile = "data/%s.json"

type Identifier struct {
	SwiftCode     string   `json:"swift_code"`
	RoutingNumber []string `json:"routing_number"`
	IfscCode      string   `json:"ifsc_code"`
}

type Branch struct {
	Code        string     `json:"code"`
	City        string     `json:"city"`
	Identifiers Identifier `json:"identifiers"`
}

type BankDetails struct {
	Name      string   `json:"name"`
	ShortCode string   `json:"short_code"`
	Branches  []Branch `json:"branches"`
}

type BankInfo struct {
	Defaults struct {
		IdentifierType string `json:"identifier_type"`
	} `json:"defaults"`
	Details []BankDetails `json:"details"`
}

const (
	IdentifierTypeSWIFT         = "SWIFT"
	IdentifierTypeRoutingNumber = "ROUTING_NUMBER"
	IdentifierTypeIFSC          = "IFSC"
)

func loadBankInfo(countryCode string) (*BankInfo, error) {
	if countryCode == "" {
		return nil, errors.New("country code is empty")
	}

	// Construct file path
	filePath := fmt.Sprintf(DataFile, strings.ToUpper(countryCode))

	// Load JSON file from embedded filesystem
	data, err := bankJsonDir.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Parse JSON data into Go struct
	var bankInfo BankInfo
	err = json.Unmarshal(data, &bankInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	return &bankInfo, nil
}

func IsValidBankIdentifier(countryCode, identifierType, identifierValue string) (bool, error) {
	if countryCode == "" || identifierType == "" || identifierValue == "" {
		return false, errors.New("countryCode, identifierType, and identifierValue must not be empty")
	}

	// Load the bank info from embedded filesystem
	bankInfo, err := loadBankInfo(countryCode)
	if err != nil {
		return false, fmt.Errorf("failed to load bank information for country %s: %w", countryCode, err)
	}

	// Iterating over bank details to validate the identifier value
	for _, bank := range bankInfo.Details {
		for _, branch := range bank.Branches {
			switch identifierType {
			case IdentifierTypeSWIFT:
				swiftCode := strings.ToUpper(identifierValue)
				// If SWIFT code ends with "XXX", compare only the first 8 characters
				if len(swiftCode) == 11 && strings.HasSuffix(swiftCode, "XXX") {
					swiftCode = swiftCode[:8]
				}
				if strings.EqualFold(branch.Identifiers.SwiftCode, swiftCode) {
					return true, nil
				}
			case IdentifierTypeRoutingNumber:
				for _, routingNumber := range branch.Identifiers.RoutingNumber {
					if strings.EqualFold(routingNumber, identifierValue) {
						return true, nil
					}
				}
			case IdentifierTypeIFSC:
				if strings.EqualFold(branch.Identifiers.IfscCode, identifierValue) {
					return true, nil
				}
			default:
				return false, fmt.Errorf("unsupported identifier type: %s", identifierType)
			}
		}
	}

	return false, nil
}

func GetBankNameFromShortCode(countryCode, shortCode string) (string, error) {
	if countryCode == "" || shortCode == "" {
		return "", errors.New("countryCode and shortCode must not be empty")
	}

	bankInfo, err := loadBankInfo(countryCode)
	if err != nil {
		return "", fmt.Errorf("failed to load bank information for country %s: %w", countryCode, err)
	}

	for _, bank := range bankInfo.Details {
		if strings.EqualFold(bank.ShortCode, shortCode) {
			return bank.Name, nil
		}
	}

	return "", fmt.Errorf("no bank found with short code '%s' in country: %s", shortCode, countryCode)
}

func GetDefaultBankIdentifiersFromShortCode(countryCode, shortCode string) ([]string, error) {
	if countryCode == "" || shortCode == "" {
		return nil, errors.New("countryCode and shortCode must not be empty")
	}

	bankInfo, err := loadBankInfo(countryCode)
	if err != nil {
		return nil, fmt.Errorf("failed to load bank information for country %s: %w", countryCode, err)
	}

	var identifiers []string
	for _, bank := range bankInfo.Details {
		if strings.EqualFold(bank.ShortCode, shortCode) {
			for _, branch := range bank.Branches {
				switch bankInfo.Defaults.IdentifierType {
				case IdentifierTypeSWIFT:
					identifiers = append(identifiers, branch.Identifiers.SwiftCode)
				case IdentifierTypeRoutingNumber:
					identifiers = append(identifiers, branch.Identifiers.RoutingNumber...)
				case IdentifierTypeIFSC:
					identifiers = append(identifiers, branch.Identifiers.IfscCode)
				default:
					return nil, fmt.Errorf("unsupported identifier type: %s", bankInfo.Defaults.IdentifierType)
				}
			}
		}
	}

	if len(identifiers) == 0 {
		return nil, fmt.Errorf("no branches found for bank with short code '%s' in country %s", shortCode, countryCode)
	}

	return identifiers, nil
}

func GetBankNameFromBankIdentifier(countryCode, identifier string) (string, error) {
	if countryCode == "" || identifier == "" {
		return "", errors.New("countryCode and identifier must not be empty")
	}

	bankInfo, err := loadBankInfo(countryCode)
	if err != nil {
		return "", fmt.Errorf("failed to load bank information for country %s: %w", countryCode, err)
	}

	for _, bank := range bankInfo.Details {
		
		for _, branch := range bank.Branches {
			// Check SwiftCode and IfscCode directly
			if branch.Identifiers.SwiftCode == identifier || branch.Identifiers.IfscCode == identifier {
				return bank.Name, nil
			}

			// Check if identifier is in RoutingNumber list
			for _, routingNumber := range branch.Identifiers.RoutingNumber {
				if routingNumber == identifier {
					return bank.Name, nil
				}
			}
		}
	}

	return "", fmt.Errorf("no bank found for identifier '%s' in country %s", identifier, countryCode)
}

func GetSwiftCodeFromBankName(countryCode, bankName string) (string, error) {
	bankInfo, err := loadBankInfo(countryCode)
	if err != nil {
		return "", err
	}

	// Search through all banks to find a match by name
	for _, bank := range bankInfo.Details {
		if bank.Name == bankName {
			// Look for SWIFT code in the first branch that has one
			for _, branch := range bank.Branches {
				if branch.Identifiers.SwiftCode != "" {
					return branch.Identifiers.SwiftCode, nil
				}
			}
		}
	}

	return "", fmt.Errorf("no SWIFT code found for bank '%s' in country %s", bankName, countryCode)
}
