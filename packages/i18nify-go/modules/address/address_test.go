package address

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAddressList(t *testing.T) {
	list := GetAddressList()
	assert.NotEmpty(t, list)
	for cc, info := range list {
		assert.Len(t, cc, 2, "country code should be 2 chars: %s", cc)
		_ = info
	}
}

func TestGetAddressInfo_Invalid(t *testing.T) {
	_, err := GetAddressInfo("XX")
	assert.Error(t, err)

	_, err = GetAddressInfo("")
	assert.Error(t, err)
}

func TestUnmarshalAddressData(t *testing.T) {
	list := GetAddressList()
	assert.NotEmpty(t, list)
}
