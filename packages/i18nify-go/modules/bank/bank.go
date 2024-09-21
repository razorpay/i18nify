package bank

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

type Bank struct {
	Name      string   `json:"name"`
	ShortCode string   `json:"short_code"`
	Branches  []Branch `json:"branches"`
}

type Branch struct {
	City  string `json:"city"`
	Swift string `json:"swift"`
}

var globalBankData = make(map[CountryCode][]Bank)

func init() {
	_, currentFileName, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("Error getting current file directory")
	}
	err := filepath.WalkDir(filepath.Dir(currentFileName)+"/data", func(path string, d os.DirEntry, err error) error {
		if !d.IsDir() {
			bankJsonDataCountryWise, err := os.ReadFile(path)
			if err != nil {
				log.Fatal("Error getting current file directory")
			}
			bankDataCountryWise := UnmarshalBankData(bankJsonDataCountryWise)
			country, ok := getCountryNameFromFile(d.Name())
			if !ok {
				log.Fatal("invalid country data present")
			}
			globalBankData[country] = bankDataCountryWise
		}
		return nil
	})
	if err != nil {
		log.Fatal("Error reading JSON file:", err)
	}
}

func UnmarshalBankData(data []byte) []Bank {
	var r []Bank
	if err := json.Unmarshal(data, &r); err != nil {
		log.Fatal("Error reading JSON file:", err)
	}
	return r
}

func (*Bank) GetBankNameFromShortCode(country CountryCode, code string) (bool, string) {
	data := globalBankData[country]
	for _, bank := range data {
		if bank.ShortCode == code {
			return true, bank.Name
		}
	}
	return false, ""
}

func getCountryNameFromFile(fileName string) (CountryCode, bool) {
	countryCode := strings.TrimSuffix(fileName, filepath.Ext(fileName))
	if len(countryCode) == 2 {
		return CountryCode(countryCode), true
	}
	return "", false
}

func NewBank() *Bank {
	return &Bank{}
}
