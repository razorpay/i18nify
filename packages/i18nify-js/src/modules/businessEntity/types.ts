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

// Raw shape of the single source JSON file. Each map value is wrapped in an
// { items: [...] } object so the JSON validates against the proto3 schema
// (proto3 maps cannot hold repeated values directly).
export interface BusinessEntityFileData {
  categories: BusinessCategory[];
  sub_categories: Record<string, { items: BusinessSubCategory[] }>;
  entity_types: Record<string, { items: BusinessEntityType[] }>;
}

// Combined runtime type used by all utility functions.
export interface BusinessEntityData {
  business_entity_information: {
    categories: BusinessCategory[];
    sub_categories: Record<string, BusinessSubCategory[]>;
    entity_types: Record<string, BusinessEntityType[]>;
  };
}
