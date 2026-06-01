// Hand-written Go structs for business entity data.
// These mirror the data.json schema for the business_entity module.

package business_entity

// BusinessEntityData is the root structure loaded from data/data.json.
type BusinessEntityData struct {
	BusinessEntityInformation BusinessEntityInformation `json:"business_entity_information"`
}

// BusinessEntityInformation holds categories, sub-categories, and country entity types.
type BusinessEntityInformation struct {
	Categories    []BusinessCategory                   `json:"categories"`
	SubCategories map[string][]BusinessSubCategory     `json:"sub_categories"`
	EntityTypes   map[string][]BusinessEntityType      `json:"entity_types"`
}

// BusinessCategory represents a top-level business category.
type BusinessCategory struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// BusinessSubCategory represents a sub-category within a business category.
type BusinessSubCategory struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// BusinessEntityType represents a legal entity type specific to a country.
type BusinessEntityType struct {
	Code         string `json:"code"`
	Name         string `json:"name"`
	Abbreviation string `json:"abbreviation"`
	Category     string `json:"category"`
	Description  string `json:"description"`
}
