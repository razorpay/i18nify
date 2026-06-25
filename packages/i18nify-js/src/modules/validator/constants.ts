/**
 * W3C HTML Living Standard §4.10.1.1 valid e-mail address pattern.
 * Source: https://html.spec.whatwg.org/#valid-e-mail-address
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Looser variant that additionally requires at least one dot after "@",
 * enforcing a TLD-like segment (rejects bare "user@localhost").
 */
export const EMAIL_REGEX_REQUIRE_TLD =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Literal spaces and hyphens stripped from card numbers before digit analysis. */
export const CARD_SEPARATOR_REGEX = /[ -]/g;

/**
 * Minimum and maximum digit lengths defined by ISO/IEC 7812-1 for
 * primary account numbers (PANs).
 */
export const CARD_MIN_LENGTH = 13;
export const CARD_MAX_LENGTH = 19;
