package i18nify_go

import (
	"fmt"
	"i18nify/packages/i18nify-go/modules/country_currency"
	"i18nify/packages/i18nify-go/modules/country_metadata"
	"i18nify/packages/i18nify-go/modules/country_phonenumber"
	"i18nify/packages/i18nify-go/modules/country_subdivisions"
	"io/ioutil"
)

const Currency_File = "modules/country_currency/data.json"
const MetaData_File = "modules/country_metadata/data.json"
const PhoneNumber_File = "modules/country_phonenumber/data.json"
const SubDivisions_File = "modules/country_subdivisions/data.json"

type CountryV1 struct {
	currency     country_currency.CountryCurrency
	metadata     country_metadata.CountryMetadata
	phoneNumber  country_phonenumber.CountryPhonenumber
	subDivisions country_subdivisions.CountrySubdivisions
}

func (c CountryV1) GetCountryCurrency(code string) country_currency.CurrencyInformation {
	return c.currency.GetCurrencyInformation()
}

func (c CountryV1) GetCountryMetadata(code string) country_metadata.MetadataInformation {
	return c.metadata.GetMetadataInformation()
}

func (c CountryV1) GetCountryPhoneNumber(code string) country_phonenumber.CountryTeleInformation {
	return c.phoneNumber.GetCountryTeleInformation()
}

func (c CountryV1) GetCountrySubDivisions(code string) country_subdivisions.CountrySubdivisions {
	//TODO implement me
	panic("implement me")
}

//func (c CountryV1) GetCountryInformation(code string) country_metadata.CountryInformation {
//	return c.country.GetCountryInformation()[code]
//}

func NewCountryV1() ICountry {
	currencyJsonData, err := ioutil.ReadFile(Currency_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	cur, _ := country_currency.UnmarshalCountryCurrency(currencyJsonData)

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

	subDivJsonData, err := ioutil.ReadFile(SubDivisions_File)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}
	sub, _ := country_subdivisions.UnmarshalCountrySubdivisions(subDivJsonData)

	v1 := CountryV1{currency: cur, metadata: meta, phoneNumber: ph, subDivisions: sub}
	return v1
}
