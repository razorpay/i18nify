package bank

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBankData(t *testing.T) {
	present, bankName := NewBank().GetBankNameFromShortCode(MY, "PHBM")
	assert.Equal(t, true, present)
	assert.Equal(t, "AFFIN BANK BERHAD", bankName)
}
