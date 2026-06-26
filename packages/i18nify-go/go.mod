module github.com/razorpay/i18nify/packages/i18nify-go

go 1.20

require (
	github.com/razorpay/i18nify/i18nify-data/go/phone-number/dial-code-to-country v0.0.0-20260626102338-a3da62891c62
	github.com/stretchr/testify v1.9.0
	golang.org/x/text v0.22.0
)

require google.golang.org/protobuf v1.31.0 // indirect

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/razorpay/i18nify/i18nify-data/go/bankcodes v1.0.3
	github.com/razorpay/i18nify/i18nify-data/go/country/metadata v0.0.0-20260626073647-038d6ecf5476
	github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions v1.0.6
	github.com/razorpay/i18nify/i18nify-data/go/currency v1.0.3
	github.com/razorpay/i18nify/i18nify-data/go/phone-number/country-code-to-phone-number v1.0.3
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
