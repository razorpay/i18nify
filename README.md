# i18nify

_A comprehensive JavaScript toolkit designed to streamline internationalization in your applications._

Embark on a journey into the world of **i18nify**—a magical toolkit for JavaScript that transforms your app into a global linguist! 🪄✨ Imagine having specialized modules for handling phone numbers, currencies, dates, and more—like enchanted tools ensuring your app speaks fluently in any language, anywhere it goes. It's your passport to making your app a true global citizen!

**Let's get started!**

### Core Package: i18nify-js

[i18nify-js docs](https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/README.md)

Unleash the power of **i18nify-js**, the heart of all things i18nify. Its README provides detailed instructions on installation, usage, and documentation on APIs, empowering you to harness the full potential of internationalization in your projects.

### Framework Wrappers:

1. **i18nify-react**
   [i18nify-react docs](https://github.com/razorpay/i18nify/blob/master/packages/i18nify-react/README.md)

   Built as a wrapper over i18nify-js, **i18nify-react** simplifies the integration with React. Explore its README for seamless installation, API documentation, and additional features tailored for the React library.

### API Documentation
This repository also hosts the source code for 5 modules: JS/ReactJS/Go as of now.
The API is documented below:


### Go

```go
package main

import (
   "fmt"
   i18nify_go "github.com/razorpay/i18nify/packages/i18nify-go"
   "github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
)

func main() {
   //India
   countryIN := i18nify_go.NewCountry("IN")

   metaDataIN := countryIN.GetCountryMetadata()
   fmt.Println(metaDataIN.CountryName)   //India
   fmt.Println(metaDataIN.Currency)      //[INR]
   fmt.Println(metaDataIN.DialCode)      //+91
   fmt.Println(metaDataIN.Timezones)     //Asia/Kolkata:{UTC +05:30}
   fmt.Println(metaDataIN.DefaultLocale) //en_IN

   //INR
   currencyIN := countryIN.GetCountryCurrency()
   fmt.Println(currencyIN[0].Name)   //Indian Rupee
   fmt.Println(currencyIN[0].Symbol) //₹

   //India PhoneNumber
   phoneNumberIN := countryIN.GetCountryPhoneNumber()
   fmt.Println(phoneNumberIN.DialCode) //+91
   fmt.Println(phoneNumberIN.Regex)    // /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/

   //India States
   subdivisions := countryIN.GetCountrySubDivisions()
   fmt.Println(subdivisions.GetCountryName()) //India

   state := subdivisions.GetStates()["KA"]
   fmt.Println(state.GetName())      //Karnataka
   fmt.Println(state.GetCities()[0]) //{Yellāpur nan Asia/Kolkata [581337 581337 ...}

   //USD
   currencyUS := currency.GetCurrencyInformation("USD")
   fmt.Println(currencyUS.Name)   //US Dollar
   fmt.Println(currencyUS.Symbol) //$
}
```