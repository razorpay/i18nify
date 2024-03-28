## i18nify-go
_A comprehensive solution written in Go to facilitate internationalization._

## Attributes Supported
1. **Country Metadata**:
   - Provide metadata for countries, including name, supported currency, dial code, timezones, and default locale.

2. **Currency Module**:
   - Handle currency-related operations, such as retrieving currency names and symbols.

3. **Phone Number Handling**:
   - Fetch phone number related information, including dial codes and regex patterns.

4. **Subdivisions (States) Information**:
   - Support for accessing information about subdivisions (states) within countries, such as names and cities.


## Go Software Development Kit (SDK)

This package is compatible with modern versions of Go in module mode. If you have Go installed, you can add the package to your current development module and its dependencies by running:

`go get github.com/razorpay/i18nify/packages/i18nify-go`

will resolve and add the package to the current development module, along with its dependencies.

Alternatively, you can achieve the same result by importing the package in your code:

`import "github.com/razorpay/i18nify/packages/i18nify-go"`

Then, run go get without any parameters.

To use the latest version of this repository's main branch, execute the following command:

`go get github.com/razorpay/i18nify/packages/i18nify-go@master`

## Initializing the Country Package
To initialize the `Country` package in your Go application, you can use the following code snippet:
```
import (
   i18nify_go "github.com/razorpay/i18nify/packages/i18nify-go"
)

func main() {
   // Initialize the country package for a specific country (e.g., India)
   countryIN := i18nify_go.NewCountry("IN")
   
   // Now you can use countryIN to access various country-related information
   // For example usage refer to example/example.go (Link provided below)
}
```

For example usage refer to example/example.go
https://github.com/razorpay/i18nify/blob/master/packages/i18nify-go/example/example.go

## License
TBD

## Contribution
Feel free to contribute to this sdk by opening issues or pull requests. Your feedback and contributions are highly appreciated.
