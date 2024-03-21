package main

import (
	"fmt"
	i18nify_go "i18nify/packages/i18nify-go"
)

func main() {
	countryV1 := i18nify_go.NewCountryV1()
	fmt.Println(countryV1.GetCountryInformation("IN"))
	fmt.Println(countryV1.GetCountryInformation("MY"))
	fmt.Println(countryV1.GetCountryInformation("US"))
}
