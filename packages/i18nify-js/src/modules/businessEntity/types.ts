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

export interface BusinessEntityData {
  business_entity_information: {
    categories: BusinessCategory[];
    sub_categories: Record<string, BusinessSubCategory[]>;
    entity_types: Record<string, BusinessEntityType[]>;
  };
}
