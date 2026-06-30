export interface BusinessCategory {
  code: string;
  name: string;
  description: string;
}

export interface BusinessSubCategory {
  code: string;
  name: string;
  description: string;
}

// Sourced from the GLEIF ISO 20275 Entity Legal Forms (ELF) code list.
export interface BusinessEntityType {
  code: string; // ELF code (4-char alphanumeric, ISO 20275)
  name: string; // Entity legal form name in its local language
  abbreviation: string; // Local-language abbreviation, if any
  transliterated_name: string; // Transliterated name (ISO 01-140-10)
  language: string; // ISO 639-1 language code of the local name
}

// Raw shapes of the two source JSON files.
export interface CategoriesFileData {
  categories: BusinessCategory[];
  sub_categories: Record<string, BusinessSubCategory[]>;
}

export interface EntityTypesFileData {
  entity_types: Record<string, BusinessEntityType[]>;
}

// Combined runtime type used by all utility functions.
export interface BusinessEntityData {
  business_entity_information: {
    categories: BusinessCategory[];
    sub_categories: Record<string, BusinessSubCategory[]>;
    entity_types: Record<string, BusinessEntityType[]>;
  };
}
