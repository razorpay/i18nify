package i18nify_go

import (
	"fmt"
	"i18nify/packages/i18nify-go/modules/country_information"
	"io/ioutil"
)

const CountryData_File = "modules/country_information/data/country_v1.json"

type CountryV1 struct {
	country country_information.Country
}

func (c CountryV1) GetCountryInformation(code string) country_information.CountryInformation {
	return c.country.GetCountryInformation()[code]
}

func NewCountryV1() ICountry {
	jsonData, err := ioutil.ReadFile(CountryData_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	c, _ := country_information.UnmarshalCountry(jsonData)

	v1 := CountryV1{country: c}
	return v1
}
