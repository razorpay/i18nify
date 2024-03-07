package i18nify_go

import (
	"i18nify/packages/i18nify-go/modules/country_currency"
	"i18nify/packages/i18nify-go/modules/country_metadata"
	"i18nify/packages/i18nify-go/modules/country_phonenumber"
	"i18nify/packages/i18nify-go/modules/country_subdivisions"
)

type ICountry interface {
	GetCountryCurrency(code string) country_currency.CurrencyInformation
	GetCountryMetadata(code string) country_metadata.MetadataInformation
	GetCountryPhoneNumber(code string) country_phonenumber.CountryTeleInformation
	GetCountrySubDivisions(code string) country_subdivisions.CountrySubdivisions
}
