package main

import (
	"fmt"
	i18nify_go "github.com/razorpay/i18nify/packages/i18nify-go"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
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

	//INR
	currencyIN := countryIN.GetCountryCurrency()
	fmt.Println(currencyIN[0].Name)   //Indian Rupee
	fmt.Println(currencyIN[0].Symbol) //₹

	//India PhoneNumber
	phoneNumberIN := countryIN.GetCountryPhoneNumber()
	fmt.Println(phoneNumberIN.DialCode) //+91
	fmt.Println(phoneNumberIN.Regex)    // /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/

	//India States
	subdivisions := countryIN.GetCountrySubDivisions()
	fmt.Println(subdivisions.GetCountryName()) //India

	state := subdivisions.GetStates()["KA"]
	fmt.Println(state.GetName())      //Karnataka
	fmt.Println(state.GetCities()[0]) //{Yellāpur nan Asia/Kolkata [581337 581337 ...}

	//USD
	currencyUS := currency.GetCurrencyInformation("USD")
	fmt.Println(currencyUS.Name)   //US Dollar
	fmt.Println(currencyUS.Symbol) //$
}
