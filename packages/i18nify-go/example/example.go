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
	fmt.Println(metaDataIN)
	fmt.Println(metaDataIN.CountryName)
	fmt.Println(metaDataIN.Currency)
	fmt.Println(metaDataIN.DialCode)
	fmt.Println(metaDataIN.Timezones)
	fmt.Println(metaDataIN.DefaultLocale)

	//INR
	currencyIN := countryIN.GetCountryCurrency()
	fmt.Println(currencyIN[0].Name)
	fmt.Println(currencyIN[0].Symbol)

	//India PhoneNumber
	phoneNumberIN := countryIN.GetCountryPhoneNumber()
	fmt.Println(phoneNumberIN.DialCode)
	fmt.Println(phoneNumberIN.Regex)

	//India States
	subdivisions := countryIN.GetCountrySubDivisions()
	fmt.Println(subdivisions.GetCountryName())

	state := subdivisions.GetStates()["KA"]
	fmt.Println(state.GetName())
	fmt.Println(state.GetCities()[0])

	//USD
	currencyUS := currency.GetCurrencyInformation("USD")
	fmt.Println(currencyUS.Name)
	fmt.Println(currencyUS.Symbol)
}
