module github.com/razorpay/i18nify/packages/i18nify-go

go 1.20

require (
	github.com/stretchr/testify v1.9.0
	golang.org/x/text v0.22.0
)

require google.golang.org/protobuf v1.31.0 // indirect

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/razorpay/i18nify/i18nify-data/go/bankcodes v0.0.0-20260518073007-2398170fdb07
	github.com/razorpay/i18nify/i18nify-data/go/country/metadata v0.0.0-20260518073007-2398170fdb07
	github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions v0.0.0-20260518102406-bfece0aecabc
	github.com/razorpay/i18nify/i18nify-data/go/currency v0.0.0-20260518102406-bfece0aecabc
	github.com/razorpay/i18nify/i18nify-data/go/phone-number/country-code-to-phone-number v0.0.0-20260518102406-bfece0aecabc
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

// Local replace directives: these modules live in the same repo and are not
// yet published to a module proxy. Replace directives make `go` resolve them
// from disk without hitting sum.golang.org. The release workflow
// (update-dependencies.sh) drops these and pins real version tags on merge.
replace (
	github.com/razorpay/i18nify/i18nify-data/go/bankcodes => ../../i18nify-data/go/bankcodes
	github.com/razorpay/i18nify/i18nify-data/go/country/metadata => ../../i18nify-data/go/country/metadata
	github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions => ../../i18nify-data/go/country/subdivisions
	github.com/razorpay/i18nify/i18nify-data/go/currency => ../../i18nify-data/go/currency
	github.com/razorpay/i18nify/i18nify-data/go/phone-number/country-code-to-phone-number => ../../i18nify-data/go/phone-number/country-code-to-phone-number
)
