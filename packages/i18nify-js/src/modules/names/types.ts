export type NameValidationFailureReason =
  | 'too_short'
  | 'too_long'
  | 'blocklisted'
  | 'sequential_chars'
  | 'repeating_chars'
  | 'non_alpha_dominant';

export type NameValidationResult = {
  isValid: boolean;
  reason?: NameValidationFailureReason;
};

export type IsValidNameOptions = {
  /**
   * Values rejected as placeholder, test, or garbage names.
   * By default, this replaces the built-in blocklist unless
   * allowBlocklistExtension is true.
   */
  blocklist?: string[];

  /** When true, appends blocklist to the built-in default blocklist. */
  allowBlocklistExtension?: boolean;

  /** Number of sequential characters that should invalidate a name. Default: 4. */
  sequentialThreshold?: number;

  /** Number of repeated characters that should invalidate a name. Default: 3. */
  repeatingThreshold?: number;

  /** Minimum ratio of letters to non-whitespace characters. Default: 0.5. */
  alphaDominanceThreshold?: number;
};

export type NameValidationRules = {
  min_length: number;
  max_length: number;
};

export type HonorificTitle = {
  code: string;
  title: string;
  gender: string;
  description: string;
};

export type NamesData = {
  names_information: {
    validation_rules: NameValidationRules;
  };
};
