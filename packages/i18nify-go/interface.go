package i18nify_go

import (
	"i18nify/packages/i18nify-go/modules/country_metadata"
	"i18nify/packages/i18nify-go/modules/country_phonenumber"
	"i18nify/packages/i18nify-go/modules/country_subdivisions"
	"i18nify/packages/i18nify-go/modules/currency"
)

type ICountry interface {
	GetCountryMetadata() country_metadata.MetadataInformation
	GetCountrySubDivisions() country_subdivisions.CountrySubdivisions
	GetCountryPhoneNumber() country_phonenumber.CountryTeleInformation
	GetCountryCurrency() []currency.CurrencyInformation
}
