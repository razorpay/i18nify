package main

import (
	"fmt"
	i18nify_go "i18nify/packages/i18nify-go"
)

func main() {
	countryV1 := i18nify_go.NewCountryV1()

	//India
	metaData := countryV1.GetCountryMetadata("IN")
	fmt.Println(metaData)
	fmt.Println(metaData.GetCountryName())
	fmt.Println(metaData.GetCurrency())
	fmt.Println(metaData.GetDialCode())
	fmt.Println(metaData.GetTimezones())
	fmt.Println(metaData.GetDefaultLocale())

	//INR
	currency := countryV1.GetCurrency(metaData.GetCurrency()[0])
	fmt.Println(currency.GetName())
	fmt.Println(currency.GetSymbol())

	//India PhoneNumber
	phoneNumber := countryV1.GetCountryPhoneNumber("IN")
	fmt.Println(phoneNumber.GetDialCode())
	fmt.Println(phoneNumber.GetRegex())

	//India States
	subdivisions := countryV1.GetCountrySubDivisions("IN")
	fmt.Println(subdivisions.GetCountryName())

	state := subdivisions.GetStates()["KA"]
	fmt.Println(state.GetName())
	fmt.Println(state.GetCities()[0])
}
