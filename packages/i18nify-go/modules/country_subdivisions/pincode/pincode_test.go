package pincode

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

var readFileFunc = os.ReadFile

func TestGetCityAndStateForPincode(t *testing.T) {
	_, currentFileName, _, ok := runtime.Caller(0)
	if !ok {
		fmt.Println("Error getting current file directory")
	}
	jsonData, err := os.ReadFile(filepath.Join(filepath.Dir(currentFileName), "/MY.json"))

	fileName := filepath.Join(filepath.Dir(currentFileName), "/MY.json")
	// Mock implementation of os.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, nil
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = os.ReadFile
	}()

	_, err = readFileFunc(fileName)
	if err != nil {
		return
	}

	city, state, err := GetCityAndStateForPincode("MY", "50664")
	assert.Equal(t, city, "Kuala Lumpur")
	assert.Equal(t, state, "Wp Kuala Lumpur")
}

func TestGetPincodes(t *testing.T) {
	_, currentFileName, _, ok := runtime.Caller(0)

	if !ok {
		fmt.Println("Error getting current file directory")
	}
	jsonData, err := os.ReadFile(filepath.Join(filepath.Dir(currentFileName), "/MY.json"))

	fileName := filepath.Join(filepath.Dir(currentFileName), "/MY.json")
	// Mock implementation of os.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, nil
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = os.ReadFile
	}()

	_, err = readFileFunc(fileName)
	if err != nil {
		return
	}

	pincodes, err := GetPincodes("MY")
	if err != nil {
		return
	}
	assert.Subset(t, pincodes, []string{"50664"})
}
