package geo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

const (
	usTemplate = "{name}\n{organization}\n{street_address}\n{city}, {state} {zip}"
	inTemplate = "{name}\n{organization}\n{street_address}\n{city} {zip}\n{state}"
	deTemplate = "{name}\n{organization}\n{street_address}\n{zip} {city}"
	jpTemplate = "〒{zip}\n{state}\n{street_address}\n{organization}\n{name}"
	brTemplate = "{organization}\n{name}\n{street_address}\n{district}\n{city}-{state}\n{zip}"
	bfTemplate = "{name}\n{organization}\n{street_address}\n{city} {sorting_code}"
)

// ─── Full substitution ───────────────────────────────────────────────────────

func TestFormatAddress_USAllFields(t *testing.T) {
	got, err := FormatAddress(usTemplate, AddressComponents{
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

func TestFormatAddress_INAllFields(t *testing.T) {
	got, err := FormatAddress(inTemplate, AddressComponents{
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

func TestFormatAddress_DENoState(t *testing.T) {
	got, err := FormatAddress(deTemplate, AddressComponents{
		Name:          "Hans Müller",
		Organization:  "Beispiel GmbH",
		StreetAddress: "Musterstraße 1",
		Zip:           "10115",
		City:          "Berlin",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Hans Müller\nBeispiel GmbH\nMusterstraße 1\n10115 Berlin", got)
}

func TestFormatAddress_JPReversed(t *testing.T) {
	got, err := FormatAddress(jpTemplate, AddressComponents{
		Zip:           "100-0001",
		State:         "東京都",
		StreetAddress: "千代田1-1",
		Organization:  "株式会社テスト",
		Name:          "山田太郎",
	})
	assert.NoError(t, err)
	assert.Equal(t, "〒100-0001\n東京都\n千代田1-1\n株式会社テスト\n山田太郎", got)
}

func TestFormatAddress_BRDistrict(t *testing.T) {
	got, err := FormatAddress(brTemplate, AddressComponents{
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

func TestFormatAddress_BFSortingCode(t *testing.T) {
	got, err := FormatAddress(bfTemplate, AddressComponents{
		Name:          "Fatima Ouedraogo",
		StreetAddress: "Avenue Kwame Nkrumah",
		City:          "Ouagadougou",
		SortingCode:   "01 BP 10",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Fatima Ouedraogo\nAvenue Kwame Nkrumah\nOuagadougou 01 BP 10", got)
}

// ─── Blank line removal ──────────────────────────────────────────────────────

func TestFormatAddress_OmitOrganization(t *testing.T) {
	got, err := FormatAddress(usTemplate, AddressComponents{
		Name:          "Jane Smith",
		StreetAddress: "742 Evergreen Terrace",
		City:          "Springfield",
		State:         "IL",
		Zip:           "62704",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Jane Smith\n742 Evergreen Terrace\nSpringfield, IL 62704", got)
}

func TestFormatAddress_OmitNameAndOrg(t *testing.T) {
	got, err := FormatAddress(usTemplate, AddressComponents{
		StreetAddress: "1 Main St",
		City:          "Boston",
		State:         "MA",
		Zip:           "02101",
	})
	assert.NoError(t, err)
	assert.Equal(t, "1 Main St\nBoston, MA 02101", got)
}

func TestFormatAddress_OmitDistrictBR(t *testing.T) {
	got, err := FormatAddress(brTemplate, AddressComponents{
		Name:          "Carlos",
		StreetAddress: "Rua A, 10",
		City:          "Rio de Janeiro",
		State:         "RJ",
		Zip:           "20040-020",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Carlos\nRua A, 10\nRio de Janeiro-RJ\n20040-020", got)
}

func TestFormatAddress_LiteralSeparatorPreservedWithMissingToken(t *testing.T) {
	// US: "{city}, {state} {zip}" with no state → "Springfield,  62701" — non-blank, kept
	got, err := FormatAddress(usTemplate, AddressComponents{
		Name:          "Bob",
		StreetAddress: "1 Park Ave",
		City:          "Springfield",
		Zip:           "62701",
	})
	assert.NoError(t, err)
	assert.Equal(t, "Bob\n1 Park Ave\nSpringfield,  62701", got)
}

func TestFormatAddress_AllTokensEmptyNoLiterals(t *testing.T) {
	// DE template has no literal separators — all lines become empty
	got, err := FormatAddress(deTemplate, AddressComponents{})
	assert.NoError(t, err)
	assert.Equal(t, "", got)
}

func TestFormatAddress_LiteralSeparatorKeptWhenAllEmpty(t *testing.T) {
	// US: "{city}, {state} {zip}" → ",  " → trims to "," — non-blank, kept
	got, err := FormatAddress(usTemplate, AddressComponents{})
	assert.NoError(t, err)
	assert.Equal(t, ",", got)
}

// ─── Custom templates ────────────────────────────────────────────────────────

func TestFormatAddress_SingleLineTemplate(t *testing.T) {
	got, err := FormatAddress("{name}, {city}", AddressComponents{Name: "Alice", City: "Paris"})
	assert.NoError(t, err)
	assert.Equal(t, "Alice, Paris", got)
}

func TestFormatAddress_SingleField(t *testing.T) {
	got, err := FormatAddress("{zip}", AddressComponents{Zip: "10001"})
	assert.NoError(t, err)
	assert.Equal(t, "10001", got)
}

func TestFormatAddress_UnknownPlaceholderUnchanged(t *testing.T) {
	got, err := FormatAddress("{name}\n{unknown_field}", AddressComponents{Name: "Alice"})
	assert.NoError(t, err)
	assert.Equal(t, "Alice\n{unknown_field}", got)
}

// ─── Error cases ─────────────────────────────────────────────────────────────

func TestFormatAddress_EmptyTemplate(t *testing.T) {
	_, err := FormatAddress("", AddressComponents{Name: "Alice"})
	assert.Error(t, err)
}

func TestFormatAddress_WhitespaceOnlyTemplate(t *testing.T) {
	_, err := FormatAddress("   ", AddressComponents{Name: "Alice"})
	assert.Error(t, err)
}
