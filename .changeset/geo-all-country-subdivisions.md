---
'@razorpay/i18nify-js': minor
---

feat(geo): ship state-level subdivisions for all ISO-3166 countries. `getStates`
now returns states for every country (gated by the new
`I18NIFY_SUBDIVISION_SUPPORTED_COUNTRIES`); city/zipcode lookups remain scoped to
the rich-data countries (IN, MY, SG, US).
