export type PostalCodeFormat = 'numeric' | 'alphanumeric' | 'none';

export type PostalCodeInfo = {
  country_name: string;
  format: PostalCodeFormat;
  zip_regex: string;
  examples: string[];
};
