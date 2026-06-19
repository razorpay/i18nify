package phonenumber

import (
    "fmt"
    "strings"
)

// FormatPhoneNumber formats phoneNumber using the country's format template.
// Errors: ErrEmptyPhoneNumber, ErrInvalidPhoneNumber, ErrUnknownCountryCode.
func FormatPhoneNumber(phoneNumber string, countryCode string) (string, error) {
    ctx, err := preprocessPhone(phoneNumber, countryCode)
    if err != nil {
        return "", fmt.Errorf("FormatPhoneNumber: %w", err)
    }

    pattern := GetCountryTeleInformation(ctx.ActiveCC).Format
    if pattern == "" {
        return ctx.Cleaned, nil
    }

    prefix, local := splitAtXBoundary(ctx.Cleaned, pattern)
    localRunes := []rune(local)

    result := make([]rune, 0, len([]rune(pattern)))
    digitIdx := 0
    for _, ch := range pattern {
        if ch == 'x' {
            if digitIdx < len(localRunes) {
                result = append(result, localRunes[digitIdx])
                digitIdx++
            }
        } else {
            result = append(result, ch)
        }
    }

    return strings.TrimSpace(prefix + " " + string(result)), nil
}

// IsValidPhoneNumber validates phoneNumber for countryCode.
// Returns nil if valid, or a descriptive error explaining why it failed.
// Auto-detects country from the dial code prefix when countryCode is empty or unknown.
// Errors: ErrEmptyPhoneNumber, ErrInvalidPhoneNumber, ErrUnknownCountryCode, ErrNoRegexForCountry, ErrPhoneNumberMismatch.
func IsValidPhoneNumber(phoneNumber string, countryCode string) error {
    ctx, err := preprocessPhone(phoneNumber, countryCode)
    if err != nil {
        return err
    }

    info := GetCountryTeleInformation(ctx.ActiveCC)
    if info.Regex == "" {
        return fmt.Errorf("%w: %q", ErrNoRegexForCountry, ctx.ActiveCC)
    }

    if !matchesEntirely(getPhoneNumberWithoutDialCode(ctx.Cleaned), info.Regex) {
        return fmt.Errorf("%w: %q for country %q", ErrPhoneNumberMismatch, phoneNumber, ctx.ActiveCC)
    }

    return nil
}

// PhoneInfo holds the structured result of parsing a phone number.
type PhoneInfo struct {
    CountryCode          string `json:"countryCode"`
    DialCode             string `json:"dialCode"`
    FormattedPhoneNumber string `json:"formattedPhoneNumber"`
    FormatTemplate       string `json:"formatTemplate"`
    PhoneNumber          string `json:"phoneNumber"`
}

// ParsePhoneNumber parses phoneNumber and returns a PhoneInfo (country, dial code, formatted number, local number).
// Errors: ErrEmptyPhoneNumber, ErrInvalidPhoneNumber, ErrUnknownCountryCode.
func ParsePhoneNumber(phoneNumber string, country string) (PhoneInfo, error) {
    ctx, err := preprocessPhone(phoneNumber, country)
    if err != nil {
        return PhoneInfo{}, fmt.Errorf("ParsePhoneNumber: %w", err)
    }

    formattedPhoneNumber, formatErr := FormatPhoneNumber(ctx.Cleaned, ctx.ActiveCC)
    if formatErr != nil {
        formattedPhoneNumber = ctx.Cleaned
    }

    pattern := GetCountryTeleInformation(ctx.ActiveCC).Format
    if pattern == "" {
        return PhoneInfo{
            CountryCode:          ctx.ActiveCC,
            DialCode:             ctx.DetectedDC,
            FormattedPhoneNumber: ctx.Cleaned,
            FormatTemplate:       "",
            PhoneNumber:          ctx.Cleaned,
        }, nil
    }

    _, localNumber := splitAtXBoundary(ctx.Cleaned, pattern)

    return PhoneInfo{
        CountryCode:          ctx.ActiveCC,
        DialCode:             ctx.DetectedDC,
        FormattedPhoneNumber: formattedPhoneNumber,
        FormatTemplate:       pattern,
        PhoneNumber:          localNumber,
    }, nil
}