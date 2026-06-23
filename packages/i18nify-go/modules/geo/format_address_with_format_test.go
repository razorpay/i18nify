package geo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormatAddressWithFormat_US(t *testing.T) {
	got, err := FormatAddressWithFormat("US", AddressComponents{
		Name:          "John Doe",
		Organization:  "Acme Corp",
		StreetAddress: "1600 Amphitheatre Pkwy",
		City:          "Mountain View",
		State:         "CA",
		Zip:           "94043",
	})
	assert.NoError(t, err)
	assert.Equal(t, "John Doe\nAcme Corp\n1600 Amphitheatre Pkwy\nMountain View, CA 94043", got)
}

func TestFormatAddressWithFormat_IN(t *testing.T) {
	got, err := FormatAddressWithFormat("IN", AddressComponents{
		Name:          "Rahul Sharma",
		Organization:  "Razorpay",
		StreetAddress: "SJR Cyber, 22, Laskar Hosur Rd",
		City:          "Bengaluru",
		Zip:           "560102",
		State:         "Karnataka",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Rahul Sharma\nRazorpay\nSJR Cyber, 22, Laskar Hosur Rd\nBengaluru 560102\nKarnataka", got)
}

func TestFormatAddressWithFormat_DE(t *testing.T) {
	got, err := FormatAddressWithFormat("DE", AddressComponents{
		Name:          "Hans Müller",
		Organization:  "Beispiel GmbH",
		StreetAddress: "Musterstraße 1",
		Zip:           "10115",
		City:          "Berlin",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Hans Müller\nBeispiel GmbH\nMusterstraße 1\n10115 Berlin", got)
}

func TestFormatAddressWithFormat_JP(t *testing.T) {
	got, err := FormatAddressWithFormat("JP", AddressComponents{
		Zip:           "100-0001",
		State:         "東京都",
		StreetAddress: "千代田1-1",
		Organization:  "株式会社テスト",
		Name:          "山田太郎",
	})
	assert.NoError(t, err)
	assert.Equal(t, "〒100-0001\n東京都\n千代田1-1\n株式会社テスト\n山田太郎", got)
}

func TestFormatAddressWithFormat_BR(t *testing.T) {
	got, err := FormatAddressWithFormat("BR", AddressComponents{
		Organization:  "Empresa Ltda",
		Name:          "João Silva",
		StreetAddress: "Rua das Flores, 123",
		District:      "Centro",
		City:          "São Paulo",
		State:         "SP",
		Zip:           "01310-100",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Empresa Ltda\nJoão Silva\nRua das Flores, 123\nCentro\nSão Paulo-SP\n01310-100", got)
}

func TestFormatAddressWithFormat_LowercaseCode(t *testing.T) {
	got, err := FormatAddressWithFormat("us", AddressComponents{
		Name:          "Jane",
		StreetAddress: "1 Main St",
		City:          "Boston",
		State:         "MA",
		Zip:           "02101",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Jane\n1 Main St\nBoston, MA 02101", got)
}

func TestFormatAddressWithFormat_WhitespacePaddedCode(t *testing.T) {
	got, err := FormatAddressWithFormat("  IN  ", AddressComponents{
		Name:          "Priya",
		StreetAddress: "12 MG Road",
		City:          "Pune",
		Zip:           "411001",
		State:         "Maharashtra",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Priya\n12 MG Road\nPune 411001\nMaharashtra", got)
}

func TestFormatAddressWithFormat_OmitOrganization(t *testing.T) {
	got, err := FormatAddressWithFormat("US", AddressComponents{
		Name:          "Jane Smith",
		StreetAddress: "742 Evergreen Terrace",
		City:          "Springfield",
		State:         "IL",
		Zip:           "62704",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Jane Smith\n742 Evergreen Terrace\nSpringfield, IL 62704", got)
}

func TestFormatAddressWithFormat_AllTokensEmpty(t *testing.T) {
	// DE: no literal separators — all lines blank
	got, err := FormatAddressWithFormat("DE", AddressComponents{})
	assert.NoError(t, err)
	assert.Equal(t, "", got)
}

func TestFormatAddressWithFormat_LiteralSeparatorKept(t *testing.T) {
	// US: "{city}, {state} {zip}" → ",  " → trims to ","
	got, err := FormatAddressWithFormat("US", AddressComponents{})
	assert.NoError(t, err)
	assert.Equal(t, ",", got)
}

func TestFormatAddressWithFormat_UnknownCode(t *testing.T) {
	_, err := FormatAddressWithFormat("ZZ", AddressComponents{Name: "Test"})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), `"ZZ"`)
}

func TestFormatAddressWithFormat_EmptyCode(t *testing.T) {
	_, err := FormatAddressWithFormat("", AddressComponents{})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "must not be empty")
}

func TestFormatAddressWithFormat_WhitespaceOnlyCode(t *testing.T) {
	_, err := FormatAddressWithFormat("   ", AddressComponents{})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "must not be empty")
}
