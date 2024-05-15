// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    pincode, err := UnmarshalPincode(bytes)
//    bytes, err = pincode.Marshal()

package pincode

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

const DataFile = "modules/country_subdivisions/pincode/"

type Pincode map[string]PincodeValue

func UnmarshalPincode(data []byte) (Pincode, error) {
	var r Pincode
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Pincode) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type PincodeValue struct {
	City  string `json:"city"`
	State string `json:"state"`
}

func (r *PincodeValue) GetCity() string {
	return r.City
}

func (r *PincodeValue) GetState() string {
	return r.State
}

func GetCityAndStateForPincode(country string, pincode string) (string, string, error) {
	_, currentFileName, _, ok := runtime.Caller(0)
	fileContent, err := os.ReadFile(filepath.Join(filepath.Dir(currentFileName), country+".json"))
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return "", "", err
	}

	var pincodeData map[string]PincodeValue
	err = json.Unmarshal(fileContent, &pincodeData)
	if err != nil {
		fmt.Println("Error unmarshaling JSON data:", err)
		return "", "", err
	}

	pincodeDetails, ok := pincodeData[pincode]
	if !ok {
		fmt.Println("Pincode not found:", country)
		return "", "", err
	}

	return pincodeDetails.City, pincodeDetails.State, nil
}

func GetPincodes(country string) ([]string, error) {
	_, currentFileName, _, _ := runtime.Caller(0)
	fileContent, err := os.ReadFile(filepath.Join(filepath.Dir(currentFileName), country+".json"))
	var pincodes []string

	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil, err
	}

	var pincodeData map[string]PincodeValue
	err = json.Unmarshal(fileContent, &pincodeData)
	if err != nil {
		fmt.Println("Error unmarshaling JSON data:", err)
		return nil, err
	}

	for code, _ := range pincodeData {
		pincodes = append(pincodes, code)
	}

	return pincodes, nil
}

func NewPincodeValue(city string, state string) *PincodeValue {
	return &PincodeValue{
		City:  city,
		State: state,
	}
}
