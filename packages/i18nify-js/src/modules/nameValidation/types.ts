export type NameValidationReason =
  | 'blocklisted'
  | 'sequential_chars'
  | 'repeating_chars'
  | 'non_alpha_dominant';

export interface IsValidNameOptions {
  /**
   * Names to explicitly block. Replaces the default blocklist unless
   * allowBlocklistExtension is true, in which case it is appended.
   */
  blocklist?: string[];
  /** When true, merges blocklist into the default list instead of replacing it. */
  allowBlocklistExtension?: boolean;
  /** Minimum run of consecutive ASCII-ordered characters to flag. Default: 4. */
  sequentialThreshold?: number;
  /** Minimum run of identical characters to flag. Default: 3. */
  repeatingThreshold?: number;
  /**
   * Minimum fraction of the name (excluding whitespace) that must be
   * alphabetic. Values below this threshold fail the dominance check.
   * Range 0–1, default: 0.5.
   */
  alphaDominanceThreshold?: number;
}

export interface NameValidationResult {
  isValid: boolean;
  /** Present only when isValid is false. */
  reason?: NameValidationReason;
}
