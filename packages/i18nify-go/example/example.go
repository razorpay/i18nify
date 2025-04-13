package main

import (
	"fmt"

	i18nify_go "github.com/razorpay/i18nify/packages/i18nify-go"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/bankcodes"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/phonenumber"
)

func main() {
	//India
	countryIN := i18nify_go.NewCountry("IN")

	metaDataIN := countryIN.GetCountryMetadata()
	fmt.Println(metaDataIN.CountryName)       //India
	fmt.Println(metaDataIN.SupportedCurrency) //[INR]
	fmt.Println(metaDataIN.DialCode)          //+91
	fmt.Println(metaDataIN.Timezones)         //Asia/Kolkata:{UTC +05:30}
	fmt.Println(metaDataIN.DefaultLocale)     //en_IN

	// Currency Examples
	// Get currency information for INR
	currencyIN := countryIN.GetCountryCurrency()
	fmt.Println(currencyIN[0].Name)                          //Indian Rupee
	fmt.Println(currencyIN[0].Symbol)                        //₹
	fmt.Println(currencyIN[0].MinorUnit)                     //2
	fmt.Println(currencyIN[0].NumericCode)                   //356
	fmt.Println(currencyIN[0].PhysicalCurrencyDenominations) //[1, 2, 5, 10, 20, 50, 100, 200, 500, 2000]

	// Get currency symbol directly
	symbol, err := currency.GetCurrencySymbol("INR")
	if err != nil {
		fmt.Printf("Error getting currency symbol: %v\n", err)
	} else {
		fmt.Printf("Currency symbol: %s\n", symbol) //₹
	}

	// Get currency information for USD
	currencyUS, err := currency.GetCurrencyInformation("USD")
	if err != nil {
		fmt.Printf("Error getting currency information: %v\n", err)
	} else {
		fmt.Println(currencyUS.Name)                          //US Dollar
		fmt.Println(currencyUS.Symbol)                        //$
		fmt.Println(currencyUS.MinorUnit)                     //2
		fmt.Println(currencyUS.NumericCode)                   //840
		fmt.Println(currencyUS.PhysicalCurrencyDenominations) //[1, 5, 10, 25, 50, 100]
	}

	// Phone Number Examples
	// Get phone number information for India
	phoneNumberIN := countryIN.GetCountryPhoneNumber()
	fmt.Println(phoneNumberIN.DialCode) //+91
	fmt.Println(phoneNumberIN.Regex)    // /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/

	// Format a sample phone number
	phoneInfo := phonenumber.GetCountryTeleInformation("IN")
	fmt.Printf("Phone number format: %s%s\n", phoneInfo.DialCode, "9876543210") // +919876543210

	//India States
	subdivisions := countryIN.GetCountrySubDivisions()
	fmt.Println(subdivisions.GetCountryName()) //India

	state := subdivisions.GetStates()["KA"]
	fmt.Println(state.GetName())        //Karnataka
	fmt.Println(state.GetCities()[0])   //{Yellāpur nan Asia/Kolkata [581337 581337 ...}
	fmt.Println(len(state.GetCities())) //58

	// Get States by zipcode
	madhyaPradesh := countryIN.GetStatesByZipCode("452010")[0]
	fmt.Printf("For pincode 452010 state : %s\n", madhyaPradesh) // {[{Wārāseonī nan Asia/Kolkata [481331 ...}
	fmt.Printf("State name %s\n", madhyaPradesh.GetName())

	// Get Cities
	cityList := madhyaPradesh.Cities
	fmt.Println("Cities :")
	for _, city := range cityList {
		fmt.Println(city.Name)
	}

	// Get zipcodes by city
	zipcodes := countryIN.GetZipCodesFromCity("indore")
	for _, val := range zipcodes {
		fmt.Println(val)
	}

	// Bank Codes Examples
	// Validate IFSC code
	isValid, err := bankcodes.IsValidBankIdentifier("IN", bankcodes.IdentifierTypeIFSC, "HDFC0000001")
	if err != nil {
		fmt.Printf("Error validating IFSC code: %v\n", err)
	} else {
		fmt.Printf("Is valid IFSC code: %v\n", isValid)
	}

	// Get bank name from short code
	bankName, err := bankcodes.GetBankNameFromShortCode("IN", "HDFC")
	if err != nil {
		fmt.Printf("Error getting bank name: %v\n", err)
	} else {
		fmt.Printf("Bank name: %s\n", bankName)
	}

	// Get default bank identifiers
	identifiers, err := bankcodes.GetDefaultBankIdentifiersFromShortCode("IN", "HDFC")
	if err != nil {
		fmt.Printf("Error getting bank identifiers: %v\n", err)
	} else {
		fmt.Printf("Bank identifiers: %v\n", identifiers)
	}

	// Get bank name from identifier
	bankName, err = bankcodes.GetBankNameFromBankIdentifier("IN", "HDFC0000001")
	if err != nil {
		fmt.Printf("Error getting bank name from identifier: %v\n", err)
	} else {
		fmt.Printf("Bank name from identifier: %s\n", bankName)
	}
}
