package duitnow

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetSupportedBanks(t *testing.T) {
	banks := GetSupportedBanks()
	require.Len(t, banks, 48)

	var retail, corporate int
	byCode := make(map[string]SupportedBank, len(banks))
	for _, b := range banks {
		require.NotEmpty(t, b.Code)
		require.True(t, b.Retail || b.Corporate, "code %q must be supported for at least one segment", b.Code)
		_, dup := byCode[b.Code]
		require.False(t, dup, "code %q listed twice", b.Code)
		byCode[b.Code] = b
		if b.Retail {
			retail++
		}
		if b.Corporate {
			corporate++
		}
	}
	assert.Equal(t, 44, retail)
	assert.Equal(t, 32, corporate)

	assert.Equal(t, SupportedBank{Code: "CIBB", Retail: true, Corporate: true}, byCode["CIBB"])
	assert.Equal(t, SupportedBank{Code: "MB2U", Retail: true, Corporate: false}, byCode["MB2U"])
	assert.Equal(t, SupportedBank{Code: "DEUT", Retail: false, Corporate: true}, byCode["DEUT"])
}

func TestGetBanks(t *testing.T) {
	banks := GetBanks()
	require.Len(t, banks, 25)

	// Row order is part of the data: rows can share a code (CIMY appears on two rows).
	assert.Equal(t, Bank{Key: "AGOB", Name: "Agro Bank", FPXCode: "AGOB", OBWCode: "AGMY"}, banks[0])
	assert.Equal(t, Bank{Key: "CIMY", Name: "CIMB Bank", FPXCode: "", OBWCode: "CIMY"}, banks[len(banks)-1])

	for _, b := range banks {
		assert.NotEmpty(t, b.Key)
		assert.NotEmpty(t, b.Name)
		assert.True(t, b.FPXCode != "" || b.OBWCode != "", "bank %q must have at least one rail", b.Key)
	}
}

func TestGetObwEnabledCodes(t *testing.T) {
	assert.Equal(t, []string{"AFBQ", "FNXS", "UOVB", "PICA", "AGMY", "DASH", "CIMY"}, GetObwEnabledCodes())
}

func TestGettersReturnCopies(t *testing.T) {
	GetSupportedBanks()[0].Code = "MUTATED"
	GetBanks()[0].Key = "MUTATED"
	GetObwEnabledCodes()[0] = "MUTATED"

	assert.NotEqual(t, "MUTATED", GetSupportedBanks()[0].Code)
	assert.NotEqual(t, "MUTATED", GetBanks()[0].Key)
	assert.NotEqual(t, "MUTATED", GetObwEnabledCodes()[0])
}
