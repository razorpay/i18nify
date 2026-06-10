package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCurrencyList(t *testing.T) {
	list := GetCurrencyList()
	assert.NotNil(t, list)
	assert.Greater(t, len(list), 100)

	usd, ok := list["USD"]
	assert.True(t, ok)
	assert.Equal(t, "US Dollar", usd.Name)
	assert.Equal(t, "$", usd.Symbol)

	inr, ok := list["INR"]
	assert.True(t, ok)
	assert.Equal(t, "Indian Rupee", inr.Name)
}
