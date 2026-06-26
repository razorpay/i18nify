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

export interface BusinessEntityType {
  code: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
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
