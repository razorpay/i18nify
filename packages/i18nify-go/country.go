package i18nify_go

import (
	"fmt"
	"i18nify/packages/i18nify-go/modules/country_metadata"
	"i18nify/packages/i18nify-go/modules/country_phonenumber"
	"i18nify/packages/i18nify-go/modules/country_subdivisions"
	"i18nify/packages/i18nify-go/modules/currency"
	"io/ioutil"
)

const Currency_File = "modules/currency/data.json"
const MetaData_File = "modules/country_metadata/data.json"
const PhoneNumber_File = "modules/country_phonenumber/data.json"
const SubDivisions_File = "modules/country_subdivisions/"

type CountryV1 struct {
	metadata     country_metadata.CountryMetadata
	phoneNumber  country_phonenumber.CountryPhonenumber
	subDivisions country_subdivisions.CountrySubdivisions
	currency     currency.Currency
}

func (c CountryV1) GetCountryMetadata(code string) country_metadata.MetadataInformation {
	return c.metadata.GetMetadataInformation()[code]
}

func (c CountryV1) GetCountryPhoneNumber(code string) country_phonenumber.CountryTeleInformation {
	return c.phoneNumber.GetCountryTeleInformation()[code]
}

func (c CountryV1) GetCountrySubDivisions(code string) country_subdivisions.CountrySubdivisions {
	subDivJsonData, err := ioutil.ReadFile(SubDivisions_File + code + ".json")
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return country_subdivisions.CountrySubdivisions{}
	}
	sub, _ := country_subdivisions.UnmarshalCountrySubdivisions(subDivJsonData)
	c.subDivisions = sub
	return c.subDivisions
}

func (c CountryV1) GetCurrency(currencyCode string) currency.CurrencyInformation {
	return c.currency.GetCurrencyInformation()[currencyCode]
}

func NewCountryV1() ICountry {
	currencyJsonData, err := ioutil.ReadFile(Currency_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	cur, _ := currency.UnmarshalCurrency(currencyJsonData)

	metaJsonData, err := ioutil.ReadFile(MetaData_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	meta, _ := country_metadata.UnmarshalCountryMetadata(metaJsonData)

	phoneJsonData, err := ioutil.ReadFile(PhoneNumber_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	ph, _ := country_phonenumber.UnmarshalCountryPhonenumber(phoneJsonData)

	v1 := CountryV1{metadata: meta, phoneNumber: ph, currency: cur}
	return v1
}
