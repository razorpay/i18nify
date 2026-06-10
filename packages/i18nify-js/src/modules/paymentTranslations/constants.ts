export const PAYMENT_TRANSLATIONS_CODE_LIST = [
  "hi",
  "bn",
  "mr",
  "gu",
  "ta",
  "te",
  "kn"
] as const;

export type SupportedLanguageCode = typeof PAYMENT_TRANSLATIONS_CODE_LIST[number];
