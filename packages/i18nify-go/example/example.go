package main

import (
	"fmt"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/date_time"
	"time"
)

func main() {
	//India
	//countryIN := i18nify_go.NewCountry("IN")
	//
	//metaDataIN := countryIN.GetCountryMetadata()
	//fmt.Println(metaDataIN.CountryName)       //India
	//fmt.Println(metaDataIN.SupportedCurrency) //[INR]
	//fmt.Println(metaDataIN.DialCode)          //+91
	//fmt.Println(metaDataIN.Timezones)         //Asia/Kolkata:{UTC +05:30}
	//fmt.Println(metaDataIN.DefaultLocale)     //en_IN
	//
	////INR
	//currencyIN := countryIN.GetCountryCurrency()
	//fmt.Println(currencyIN[0].Name)   //Indian Rupee
	//fmt.Println(currencyIN[0].Symbol) //₹
	//
	////India PhoneNumber
	//phoneNumberIN := countryIN.GetCountryPhoneNumber()
	//fmt.Println(phoneNumberIN.DialCode) //+91
	//fmt.Println(phoneNumberIN.Regex)    // /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/
	//
	////India States
	//subdivisions := countryIN.GetCountrySubDivisions()
	//fmt.Println(subdivisions.GetCountryName()) //India
	//
	//state := subdivisions.GetStates()["KA"]
	//fmt.Println(state.GetName())        //Karnataka
	//fmt.Println(state.GetCities()[0])   //{Yellāpur nan Asia/Kolkata [581337 581337 ...}
	//fmt.Println(len(state.GetCities())) //58
	//
	//// Get States by zipcode
	//// As suggested online there are some cases in which one zipcode can be
	//madhyaPradesh := countryIN.GetStatesByZipCode("452010")[0]
	//fmt.Printf("For pincode 452010 state : %s\n", madhyaPradesh) // {[{Wārāseonī nan Asia/Kolkata [481331 ...}
	//fmt.Printf("State name %s\n", madhyaPradesh.GetName())
	//
	//// Get Cities
	//cityList := madhyaPradesh.Cities
	//fmt.Println("Cities :")
	//for _, city := range cityList {
	//	fmt.Println(city.Name)
	//}
	//
	//// Get zipcodes by city
	//zipcodes := countryIN.GetZipCodesFromCity("indore")
	//for _, val := range zipcodes {
	//	fmt.Println(val)
	//}
	//
	////USD
	//currencyUS, _ := currency.GetCurrencyInformation("USD")
	//fmt.Println(currencyUS.Name)   //US Dollar
	//fmt.Println(currencyUS.Symbol) //$

	// date_time
	// get date in time format
	currentDateTime, _ := date_time.StringToDate("12/12/2024") //2024-12-12 00:00:00 +0000 UTC
	fmt.Println("currentDate ", currentDateTime)

	// get dateTime in specific format with Locale
	date, err := date_time.FormatDateTime("2024-12-12 00:00:00 +0000 UTC", &date_time.DateTimeOptions{
		DateTimeMode: date_time.DateTimeMode,
		IntlOptions: &date_time.IntlOptions{
			Locale: "IST",
		},
	})
	fmt.Println("IST converted dateTime ", date, err) //12/12/2024, 05:30:00 IST
	// get dateTime in specific format without Locale
	date, err = date_time.FormatDateTime("2024-12-12 00:00:00 +0000 UTC", &date_time.DateTimeOptions{
		DateTimeMode: date_time.DateTimeMode,
		IntlOptions:  &date_time.IntlOptions{},
	})
	fmt.Println("No Locale passed converted dateTime ", date, err) //12/12/2024, 00:00:00

	// get relative time
	relativeDate := time.Now().Add(365 * date_time.Day).Format(time.RFC3339)
	currentDate := time.Now().Format(time.RFC3339)
	relativeTime, err := date_time.GetRelativeTime(relativeDate, date_time.DateTimeOptions{
		BaseDate: currentDate,
	})
	fmt.Println("Relative time (future) - ", relativeTime, err) //  in 1 Year

	relativeDate = time.Now().Add(-365 * date_time.Day).Format(time.RFC3339)
	relativeTime, err = date_time.GetRelativeTime(relativeDate, date_time.DateTimeOptions{
		BaseDate: currentDate,
	})
	fmt.Println("Relative time (past) - ", relativeTime, err) // 1 Year ago

	// add convert to major unit and minor unit examples
}
