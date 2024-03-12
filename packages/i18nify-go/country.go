package i18nify_go

import (
	metadata "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
	phonenumber "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_phonenumber"
	subdivisions "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	currency "github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
)

type Country struct {
	code string
}

func (c Country) GetCountryMetadata() metadata.MetadataInformation {
	return metadata.GetMetadataInformation(c.code)
}

func (c Country) GetCountryPhoneNumber() phonenumber.CountryTeleInformation {
	return phonenumber.GetCountryTeleInformation(c.code)
}

func (c Country) GetCountrySubDivisions() subdivisions.CountrySubdivisions {
	return subdivisions.GetCountrySubdivisions(c.code)
}

func (c Country) GetCountryCurrency() []currency.CurrencyInformation {
	countryMetadata := c.GetCountryMetadata()

	var curInfoList []currency.CurrencyInformation
	for _, cur := range countryMetadata.GetCurrency() {
		curInfoList = append(curInfoList, currency.GetCurrencyInformation(cur))
	}
	return curInfoList
}

func NewCountry(code string) ICountry {
	return Country{
		code: code,
	}
}
