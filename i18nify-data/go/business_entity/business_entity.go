// Hand-written Go structs for business entity data.
// Data is split across two JSON files:
//   - data/categories_data.json  → categories + sub-categories
//   - data/entity_types_data.json → country-keyed entity types

package business_entity

// CategoriesFileData is the structure loaded from data/categories_data.json.
type CategoriesFileData struct {
	Categories    []BusinessCategory               `json:"categories"`
	SubCategories map[string][]BusinessSubCategory `json:"sub_categories"`
}

// EntityTypesFileData is the structure loaded from data/entity_types_data.json.
type EntityTypesFileData struct {
	EntityTypes map[string][]BusinessEntityType `json:"entity_types"`
}

// BusinessEntityData is the merged runtime structure exposed to callers.
type BusinessEntityData struct {
	BusinessEntityInformation BusinessEntityInformation
}

// BusinessEntityInformation holds categories, sub-categories, and country entity types.
type BusinessEntityInformation struct {
	Categories    []BusinessCategory
	SubCategories map[string][]BusinessSubCategory
	EntityTypes   map[string][]BusinessEntityType
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
