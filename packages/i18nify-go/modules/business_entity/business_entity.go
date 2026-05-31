// Package business_entity provides functions to retrieve business entity
// categories, sub-categories, and country-specific legal entity types.
package business_entity

import (
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/business_entity"
)

// BusinessCategory mirrors the data layer type for consumer use.
type BusinessCategory struct {
	Code        string
	Name        string
	Description string
}

// BusinessSubCategory mirrors the data layer type for consumer use.
type BusinessSubCategory struct {
	Code        string
	Name        string
	Description string
}

// BusinessEntityType mirrors the data layer type for consumer use.
type BusinessEntityType struct {
	Code         string
	Name         string
	Abbreviation string
	Category     string
	Description  string
}

var cachedData *dataSource.BusinessEntityData

func init() {
	d, err := dataSource.GetBusinessEntityData()
	if err != nil {
		panic(fmt.Sprintf("failed to load business entity data: %v", err))
	}
	cachedData = d
}

// GetBusinessCategories returns all top-level business categories.
func GetBusinessCategories() ([]BusinessCategory, error) {
	raw := cachedData.BusinessEntityInformation.Categories
	if len(raw) == 0 {
		return nil, fmt.Errorf("business entity data: no categories found")
	}
	out := make([]BusinessCategory, len(raw))
	for i, c := range raw {
		out[i] = BusinessCategory{
			Code:        c.Code,
			Name:        c.Name,
			Description: c.Description,
		}
	}
	return out, nil
}

// GetBusinessSubCategories returns sub-categories for a given category code.
// Returns an error for empty or unknown category codes.
func GetBusinessSubCategories(categoryCode string) ([]BusinessSubCategory, error) {
	categoryCode = strings.TrimSpace(strings.ToUpper(categoryCode))
	if categoryCode == "" {
		return nil, fmt.Errorf("categoryCode must not be empty")
	}
	raw, ok := cachedData.BusinessEntityInformation.SubCategories[categoryCode]
	if !ok {
		return nil, fmt.Errorf("unknown category code: %q", categoryCode)
	}
	out := make([]BusinessSubCategory, len(raw))
	for i, s := range raw {
		out[i] = BusinessSubCategory{
			Code:        s.Code,
			Name:        s.Name,
			Description: s.Description,
		}
	}
	return out, nil
}

// GetBusinessEntityType returns the legal entity types available for a given
// ISO 3166-1 alpha-2 country code (e.g., "IN", "US").
// Returns an error for empty or unsupported country codes.
func GetBusinessEntityType(countryCode string) ([]BusinessEntityType, error) {
	countryCode = strings.TrimSpace(strings.ToUpper(countryCode))
	if countryCode == "" {
		return nil, fmt.Errorf("countryCode must not be empty")
	}
	raw, ok := cachedData.BusinessEntityInformation.EntityTypes[countryCode]
	if !ok {
		return nil, fmt.Errorf("no entity types found for country code: %q", countryCode)
	}
	out := make([]BusinessEntityType, len(raw))
	for i, e := range raw {
		out[i] = BusinessEntityType{
			Code:         e.Code,
			Name:         e.Name,
			Abbreviation: e.Abbreviation,
			Category:     e.Category,
			Description:  e.Description,
		}
	}
	return out, nil
}
