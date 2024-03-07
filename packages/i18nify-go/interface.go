package i18nify_go

import (
	"i18nify/packages/i18nify-go/modules/country_metadata"
	"i18nify/packages/i18nify-go/modules/country_phonenumber"
	"i18nify/packages/i18nify-go/modules/country_subdivisions"
	"i18nify/packages/i18nify-go/modules/currency"
)

type ICountry interface {
	GetCountryMetadata(code string) country_metadata.MetadataInformation
	GetCountrySubDivisions(code string) country_subdivisions.CountrySubdivisions
	GetCountryPhoneNumber(code string) country_phonenumber.CountryTeleInformation

	GetCurrency(currencyCode string) currency.CurrencyInformation
}
