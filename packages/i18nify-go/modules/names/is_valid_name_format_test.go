package names

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

// ---- IsValidNameFormat ----

func TestIsValidNameFormat_SimpleASCII(t *testing.T) {
	assert.True(t, IsValidNameFormat("John"))
}

func TestIsValidNameFormat_FullNameWithSpace(t *testing.T) {
	assert.True(t, IsValidNameFormat("John Smith"))
}

func TestIsValidNameFormat_HyphenatedSurname(t *testing.T) {
	assert.True(t, IsValidNameFormat("Mary-Jane Watson"))
}

func TestIsValidNameFormat_ApostropheSurname(t *testing.T) {
	assert.True(t, IsValidNameFormat("O'Brien"))
}

func TestIsValidNameFormat_PeriodTitle(t *testing.T) {
	assert.True(t, IsValidNameFormat("Dr. Smith"))
}

func TestIsValidNameFormat_MinLength2(t *testing.T) {
	assert.True(t, IsValidNameFormat("Jo"))
}

func TestIsValidNameFormat_MaxLength100(t *testing.T) {
	assert.True(t, IsValidNameFormat(strings.Repeat("A", 100)))
}

func TestIsValidNameFormat_LeadingTrailingSpacesTrimmed(t *testing.T) {
	assert.True(t, IsValidNameFormat("  Alice  "))
}

func TestIsValidNameFormat_UnicodeHindi(t *testing.T) {
	assert.True(t, IsValidNameFormat("रामलाल"))
}

func TestIsValidNameFormat_UnicodeArabic(t *testing.T) {
	assert.True(t, IsValidNameFormat("محمد"))
}

func TestIsValidNameFormat_UnicodeChinese(t *testing.T) {
	assert.True(t, IsValidNameFormat("李明"))
}

func TestIsValidNameFormat_UnicodeJapanese(t *testing.T) {
	assert.True(t, IsValidNameFormat("田中"))
}

// --- Invalid names ---

func TestIsValidNameFormat_EmptyString(t *testing.T) {
	assert.False(t, IsValidNameFormat(""))
}

func TestIsValidNameFormat_SingleChar(t *testing.T) {
	assert.False(t, IsValidNameFormat("A"))
}

func TestIsValidNameFormat_OnlySpaces(t *testing.T) {
	assert.False(t, IsValidNameFormat("   "))
}

func TestIsValidNameFormat_ContainsDigit(t *testing.T) {
	assert.False(t, IsValidNameFormat("John2"))
}

func TestIsValidNameFormat_OnlyDigits(t *testing.T) {
	assert.False(t, IsValidNameFormat("12345"))
}

func TestIsValidNameFormat_AtSign(t *testing.T) {
	assert.False(t, IsValidNameFormat("John@Doe"))
}

func TestIsValidNameFormat_HashSign(t *testing.T) {
	assert.False(t, IsValidNameFormat("John#"))
}

func TestIsValidNameFormat_ExceedsMaxLength(t *testing.T) {
	assert.False(t, IsValidNameFormat(strings.Repeat("A", 101)))
}

func TestIsValidNameFormat_TabCharacter(t *testing.T) {
	assert.False(t, IsValidNameFormat("John\tDoe"))
}

func TestIsValidNameFormat_NewlineCharacter(t *testing.T) {
	assert.False(t, IsValidNameFormat("John\nDoe"))
}

func TestIsValidNameFormat_Underscore(t *testing.T) {
	assert.False(t, IsValidNameFormat("John_Doe"))
}

func TestIsValidNameFormat_ExclamationMark(t *testing.T) {
	assert.False(t, IsValidNameFormat("Alice!"))
}
