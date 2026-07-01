package datetime

import (
	"sync"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

var (
	countryMetadataData     *dataSource.CountryMetadataData
	countryMetadataDataErr  error
	countryMetadataDataOnce sync.Once
)

func getCountryMetadataData() (*dataSource.CountryMetadataData, error) {
	countryMetadataDataOnce.Do(func() {
		countryMetadataData, countryMetadataDataErr = dataSource.GetCountryMetadataData()
	})

	return countryMetadataData, countryMetadataDataErr
}
