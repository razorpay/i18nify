package i18nify_go

import (
	"i18nify/packages/i18nify-go/modules/country_information"
)

type ICountry interface {
	GetCountryInformation(code string) country_information.CountryInformation
}
