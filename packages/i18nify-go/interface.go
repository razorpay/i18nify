package i18nify_go

import (
	"i18nify/packages/i18nify-go/modules/language"
	"i18nify/packages/i18nify-go/modules/timezone"
)

type ICountry interface {
	GetCountryInformation(code string) country_information.CountryInformation
	GetLanguage(code string) language.Language
	GetTimezone(code string) timezone.Timezone
}
