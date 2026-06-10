export type EmailValidationOptions = {
  /** When true, allows addresses without a TLD (e.g. "user@localhost"). Default: false. */
  allowNoTld?: boolean;
};

export type CardValidationOptions = {
  /**
   * Accepted digit lengths. Defaults to the ISO/IEC 7812-1 range 13–19.
   * Narrow this (e.g. [16]) to accept only specific card types.
   */
  allowedLengths?: number[];
};
