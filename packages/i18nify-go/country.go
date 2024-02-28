package i18nify_go

import (
	"fmt"
	"i18nify/packages/i18nify-go/modules/language"
	"i18nify/packages/i18nify-go/modules/timezone"
	"io/ioutil"
)

const CountryData_File = "modules/country/country_v1.json"

type CountryV1 struct {
	ctry country_information.Country
}

func (c CountryV1) GetLanguage(code string) language.Language {
	//TODO implement me
	panic("implement me")
}

func (c CountryV1) GetTimezone(code string) timezone.Timezone {
	//TODO implement me
	panic("implement me")
}

func (c CountryV1) GetCountryInformation(code string) country_information.CountryInformation {
	return c.ctry.GetCountryInformation()[code]
}

func NewCountryV1() ICountry {
	jsonData, err := ioutil.ReadFile(CountryData_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	c, _ := country_information.UnmarshalCountry(jsonData)

	v1 := CountryV1{ctry: c}
	return v1
}
