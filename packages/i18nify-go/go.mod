module github.com/razorpay/i18nify/packages/i18nify-go

go 1.20

require (
	github.com/razorpay/i18nify/i18nify-data/go/currency v0.0.0-20251119111148-3496fb192e69
	github.com/stretchr/testify v1.9.0
)

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	google.golang.org/protobuf v1.31.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace github.com/razorpay/i18nify/i18nify-data/go/currency => github.com/razorpay/i18nify/i18nify-data/go/currency v0.0.0-20251119111148-3496fb192e69
