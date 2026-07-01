package main

import (
	"fmt"
	"time"

	i18nify_go "github.com/razorpay/i18nify/packages/i18nify-go"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/bankcodes"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/phonenumber"
)

func main() {
	// Basic Country Information
	countryIN := i18nify_go.NewCountry("IN")
	metaDataIN := countryIN.GetCountryMetadata()
	fmt.Printf("Country Name: %s\n", metaDataIN.CountryName)             // India
	fmt.Printf("Supported Currency: %v\n", metaDataIN.SupportedCurrency) // [INR]
	fmt.Printf("Dial Code: %s\n", metaDataIN.DialCode)                   // +91
	fmt.Printf("Timezones: %v\n", metaDataIN.Timezones)                  // Asia/Kolkata:{UTC +05:30}
	fmt.Printf("Default Locale: %s\n", metaDataIN.DefaultLocale)         // en_IN

	// Currency Information
	currencyIN := countryIN.GetCountryCurrency()
	if len(currencyIN) > 0 {
		fmt.Printf("Currency Name: %s\n", currencyIN[0].Name)                                   // Indian Rupee
		fmt.Printf("Currency Symbol: %s\n", currencyIN[0].Symbol)                               // ₹
		fmt.Printf("Minor Unit: %s\n", currencyIN[0].MinorUnit)                                 // 2
		fmt.Printf("Numeric Code: %s\n", currencyIN[0].NumericCode)                             // 356
		fmt.Printf("Physical Denominations: %v\n", currencyIN[0].PhysicalCurrencyDenominations) // [1, 2, 5, 10, 20, 50, 100, 200, 500, 2000]
	}

	// Currency conversion examples
	amount := 1234.0
	majorAmount, err := currency.ConvertToMajorUnit("INR", amount)
	if err != nil {
		fmt.Printf("Error converting to major unit: %v\n", err)
	} else {
		fmt.Printf("INR %v paise = %v rupees\n", amount, majorAmount) // INR 1234 paise = 12.34 rupees
	}

	// Convert from major to minor units
	minorAmount, err := currency.ConvertToMinorUnit("USD", 12.34)
	if err != nil {
		fmt.Printf("Error converting to minor unit: %v\n", err)
	} else {
		fmt.Printf("USD $12.34 = %v cents\n", minorAmount) // USD $12.34 = 1234 cents
	}

	// Convert a formatted currency string to minor units
	parsedMinorAmount, err := currency.ConvertStringToMinorUnit("USD", "$1,234.56")
	if err != nil {
		fmt.Printf("Error parsing currency string: %v\n", err)
	} else {
		fmt.Printf("USD $1,234.56 = %v cents\n", parsedMinorAmount) // USD $1,234.56 = 123456 cents
	}

	// Currency metadata utility examples
	denominations, err := currency.GetDenomination("INR")
	if err != nil {
		fmt.Printf("Error getting denominations: %v\n", err)
	} else {
		fmt.Printf("INR denominations: %v\n", denominations) // [1 2 5 10 20 50 100 200 500 2000]
	}

	isoNumericCode, err := currency.GetISONumericCode("INR")
	if err != nil {
		fmt.Printf("Error getting ISO numeric code: %v\n", err)
	} else {
		fmt.Printf("INR ISO numeric code: %s\n", isoNumericCode) // 356
	}

	minimumValue, err := currency.GetMinimumValue("USD")
	if err != nil {
		fmt.Printf("Error getting minimum value: %v\n", err)
	} else {
		fmt.Printf("USD minimum value: %d cents\n", minimumValue) // 50 cents
	}

	minorUnitName, err := currency.GetMinorUnitName("INR")
	if err != nil {
		fmt.Printf("Error getting minor unit name: %v\n", err)
	} else {
		fmt.Printf("INR minor unit name: %s\n", minorUnitName) // paisa
	}

	isValidAmount, err := currency.IsValidAmount("10.50", "USD")
	if err != nil {
		fmt.Printf("Error validating amount: %v\n", err)
	} else {
		fmt.Printf("Is valid USD amount: %v\n", isValidAmount) // true
	}

	fmt.Printf("Is valid currency code: %v\n", currency.IsValidCurrencyCode("USD")) // true

	// Phone Number Information
	phoneNumberIN := countryIN.GetCountryPhoneNumber()
	fmt.Printf("Dial Code: %s\n", phoneNumberIN.DialCode)  // +91
	fmt.Printf("Regex Pattern: %s\n", phoneNumberIN.Regex) // /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/

	// Format a sample phone number
	phoneInfo := phonenumber.GetCountryTeleInformation("IN")
	fmt.Printf("Formatted Phone Number: %s%s\n", phoneInfo.DialCode, "9876543210") // +919876543210

	// Format phone number according to country template
	formattedPhone, err := phonenumber.FormatPhoneNumber("+917394926646", "IN")
	if err != nil {
		fmt.Printf("Error formatting phone number: %v\n", err)
	} else {
		fmt.Printf("Formatted phone number: %s\n", formattedPhone) // +91 7394 926646
	}

	// Validate phone number
	fmt.Printf("Is valid phone number: %v\n", phonenumber.IsValidPhoneNumber("+917394926646", "IN")) // true

	// Parse phone number into structured components
	phoneData, err := phonenumber.ParsePhoneNumber("+917394926646", "IN")
	if err != nil {
		fmt.Printf("Error parsing phone number: %v\n", err)
	} else {
		fmt.Printf("Country Code: %s\n", phoneData.CountryCode)       // IN
		fmt.Printf("Dial Code: %s\n", phoneData.DialCode)             // +91
		fmt.Printf("Formatted: %s\n", phoneData.FormattedPhoneNumber) // +91 7394 926646
		fmt.Printf("Local Number: %s\n", phoneData.PhoneNumber)       // 7394926646
	}

	// Country Subdivisions
	subdivisions := countryIN.GetCountrySubDivisions()
	fmt.Printf("Country Name: %s\n", subdivisions.GetCountryName()) // India

	// Get state information
	state := subdivisions.GetStates()["KA"]
	fmt.Printf("State Name: %s\n", state.GetName()) // Karnataka
	if len(state.GetCities()) > 0 {
		fmt.Printf("First City: %v\n", state.GetCities()[0]) // {Yellāpur nan Asia/Kolkata [581337 581337 ...}
	}
	fmt.Printf("Total Cities: %d\n", len(state.GetCities())) // 58

	// Zip Code Information
	// Get state by zipcode
	states := countryIN.GetStatesByZipCode("452010")
	if len(states) > 0 {
		madhyaPradesh := states[0]
		fmt.Printf("State for pincode 452010: %s\n", madhyaPradesh.GetName()) // Madhya Pradesh

		// Get cities in the state
		fmt.Println("\nCities in Madhya Pradesh:")
		for _, city := range madhyaPradesh.Cities {
			fmt.Printf("- %s\n", city.Name)
		}
	}

	// Get zipcodes by city
	zipcodes := countryIN.GetZipCodesFromCity("indore")
	fmt.Println("\nZipcodes for Indore:")
	for _, zipcode := range zipcodes {
		fmt.Printf("- %s\n", zipcode) // 452001, 452002, etc.
	}

	// Bank Information
	// Validate IFSC code
	isValid, err := bankcodes.IsValidBankIdentifier("IN", bankcodes.IdentifierTypeIFSC, "HDFC0000001")
	if err != nil {
		fmt.Printf("Error validating IFSC code: %v\n", err)
	} else {
		fmt.Printf("Is valid IFSC code: %v\n", isValid) // true
	}

	// Get bank name from short code
	bankName, err := bankcodes.GetBankNameFromShortCode("IN", "HDFC")
	if err != nil {
		fmt.Printf("Error getting bank name: %v\n", err)
	} else {
		fmt.Printf("Bank name: %s\n", bankName) // HDFC Bank Limited
	}

	// Get default bank identifiers
	identifiers, err := bankcodes.GetDefaultBankIdentifiersFromShortCode("IN", "HDFC")
	if err != nil {
		fmt.Printf("Error getting bank identifiers: %v\n", err)
	} else {
		fmt.Printf("Bank identifiers: %v\n", identifiers) // [HDFC0000001, HDFC0000002, ...]
	}

	// Get bank name from identifier
	bankName, err = bankcodes.GetBankNameFromBankIdentifier("IN", "HDFC0000001")
	if err != nil {
		fmt.Printf("Error getting bank name from identifier: %v\n", err)
	} else {
		fmt.Printf("Bank name from identifier: %s\n", bankName) // HDFC Bank Limited
	}

	// Format number as a locale-aware currency string
	cur := currency.GetCurrency()
	formattedINR, err := cur.FormatNumber(123456.78, currency.NumberFormatOptions{
		Currency: "INR",
		Locale:   "en-IN",
	})
	if err != nil {
		fmt.Printf("Error formatting number: %v\n", err)
	} else {
		fmt.Printf("Formatted number: %s\n", formattedINR) // ₹1,23,456.78
	}

	// FormatNumberByParts — breakdown into typed components (integer, fraction, currency, decimal)
	parts, err := cur.FormatNumberByParts(12345.67, currency.NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	if err != nil {
		fmt.Printf("Error formatting number by parts: %v\n", err)
	} else {
		fmt.Printf("Currency: %s\n", parts.Currency)               // $
		fmt.Printf("Integer: %s\n", parts.Integer)                 // 12,345
		fmt.Printf("Decimal: %s\n", parts.Decimal)                 // .
		fmt.Printf("Fraction: %s\n", parts.Fraction)               // 67
		fmt.Printf("Is prefix symbol: %v\n", parts.IsPrefixSymbol) // true
	}

	// Date and Time Utilities
	// Format a date and time value
	ts := time.Date(2024, 3, 5, 14, 30, 0, 0, time.UTC)
	formattedDT, err := country_metadata.FormatDateTime(ts, country_metadata.FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: country_metadata.ModeDateTime,
	})
	if err != nil {
		fmt.Printf("Error formatting date time: %v\n", err)
	} else {
		fmt.Printf("Formatted date time: %s\n", formattedDT) // 3/5/2024 14:30:0
	}

	// Get relative time from a past date
	relTime, err := country_metadata.GetRelativeTime(
		time.Now().Add(-2*time.Hour),
		country_metadata.GetRelativeTimeOptions{Numeric: "always"},
	)
	if err != nil {
		fmt.Printf("Error getting relative time: %v\n", err)
	} else {
		fmt.Printf("Relative time: %s\n", relTime) // 2 hours ago
	}

	// Get all timezones for a country
	tzs, err := country_metadata.GetTimeZoneByCountry("IN")
	if err != nil {
		fmt.Printf("Error getting timezones by country: %v\n", err)
	} else {
		fmt.Printf("Timezones for IN: %v\n", tzs) // map[Asia/Kolkata:{+05:30}]
	}

	// Get weekday names
	weekdays, err := country_metadata.GetWeekdays(country_metadata.GetWeekdaysOptions{Locale: "en-US"})
	if err != nil {
		fmt.Printf("Error getting weekdays: %v\n", err)
	} else {
		fmt.Printf("Weekdays: %v\n", weekdays) // [Sunday Monday Tuesday Wednesday Thursday Friday Saturday]
	}

	// Multiple Countries
	// United States
	countryUS := i18nify_go.NewCountry("US")
	metaDataUS := countryUS.GetCountryMetadata()
	fmt.Printf("\nUnited States Information:\n")
	fmt.Printf("Country Name: %s\n", metaDataUS.CountryName)             // United States
	fmt.Printf("Supported Currency: %v\n", metaDataUS.SupportedCurrency) // [USD]
	fmt.Printf("Dial Code: %s\n", metaDataUS.DialCode)                   // +1

	// United Kingdom
	countryUK := i18nify_go.NewCountry("GB")
	metaDataUK := countryUK.GetCountryMetadata()
	fmt.Printf("\nUnited Kingdom Information:\n")
	fmt.Printf("Country Name: %s\n", metaDataUK.CountryName)             // United Kingdom
	fmt.Printf("Supported Currency: %v\n", metaDataUK.SupportedCurrency) // [GBP]
	fmt.Printf("Dial Code: %s\n", metaDataUK.DialCode)                   // +44
}
