package i18nify_go

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_phonenumber"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
)

type ICountry interface {
	GetCountryMetadata() country_metadata.MetadataInformation
	GetCountrySubDivisions() country_subdivisions.CountrySubdivisions
	GetCountryPhoneNumber() country_phonenumber.CountryTeleInformation
	GetCountryCurrency() []currency.CurrencyInformation
}
