package main

import (
	"fmt"
	i18nify_go "i18nify/packages/i18nify-go"
	"i18nify/packages/i18nify-go/modules/currency"
)

func main() {
	//India
	countryIN := i18nify_go.NewCountry("IN")

	metaDataIN := countryIN.GetCountryMetadata()
	fmt.Println(metaDataIN)
	fmt.Println(metaDataIN.GetCountryName())
	fmt.Println(metaDataIN.GetCurrency())
	fmt.Println(metaDataIN.GetDialCode())
	fmt.Println(metaDataIN.GetTimezones())
	fmt.Println(metaDataIN.GetDefaultLocale())

	//INR
	currencyIN := countryIN.GetCountryCurrency()
	fmt.Println(currencyIN[0].GetName())
	fmt.Println(currencyIN[0].GetSymbol())

	//India PhoneNumber
	phoneNumberIN := countryIN.GetCountryPhoneNumber()
	fmt.Println(phoneNumberIN.GetDialCode())
	fmt.Println(phoneNumberIN.GetRegex())

	//India States
	subdivisions := countryIN.GetCountrySubDivisions()
	fmt.Println(subdivisions.GetCountryName())

	state := subdivisions.GetStates()["KA"]
	fmt.Println(state.GetName())
	fmt.Println(state.GetCities()[0])

	//USD
	currencyUS := currency.GetCurrencyInformation("USD")
	fmt.Println(currencyUS.GetName())
	fmt.Println(currencyUS.GetSymbol())
}
