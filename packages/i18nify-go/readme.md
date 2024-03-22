## i18nify-go
_A comprehensive solution written in Go to facilitate internationalization._

## Go Software Development Kit (SDK)

This package is compatible with modern versions of Go in module mode. If you have Go installed, you can add the package to your current development module and its dependencies by running:

`go get github.com/razorpay/i18nify/packages/i18nify-go`

will resolve and add the package to the current development module, along with its dependencies.

Alternatively, you can achieve the same result by importing the package in your code:

`import "github.com/razorpay/i18nify/packages/i18nify-go"`

Then, run go get without any parameters.

To use the latest version of this repository's main branch, execute the following command:

`go get github.com/razorpay/i18nify/packages/i18nify-go@master`



## Quicktype(beta)
Convert json to json schema
1. quicktype data/<attribute>_v1.json -l schema -o data/schema/<attribute>_schema.json


2. quicktype -s schema data/schema/<attribute>_schema.json -o generator/go/<attribute>.go
3. mkdir -p packages/i18nify-go/modules/<attribute> && cp -R generator/go/<attribute>.go packages/i18nify-go/modules/<attribute>
