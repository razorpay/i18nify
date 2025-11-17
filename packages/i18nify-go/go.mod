module github.com/razorpay/i18nify/packages/i18nify-go

go 1.23

toolchain go1.24.3

require (
	github.com/razorpay/i18nify/i18nify-data/go/currency v0.0.0
	github.com/stretchr/testify v1.9.0
)

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	google.golang.org/protobuf v1.36.10 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace github.com/razorpay/i18nify/i18nify-data/go/currency => ../../i18nify-data/go/currency
