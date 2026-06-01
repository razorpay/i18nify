export interface HonorificTitle {
  code: string;
  title: string;
  gender: 'male' | 'female' | 'neutral';
  description: string;
}

export interface ValidationRules {
  min_length: number;
  max_length: number;
}

export interface NamesData {
  names_information: {
    honorific_titles: Record<string, HonorificTitle[]>;
    validation_rules: ValidationRules;
  };
}
