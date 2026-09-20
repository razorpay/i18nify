---
'@razorpay/i18nify-js': patch
---

perf(geo, names): stop bundling the full country metadata. `getAddressInfo` read `metadata_information` at module scope, which kept the 448 KB metadata in every `@razorpay/i18nify-js/geo` import (`getFlagOfCountry` alone was 322 KB minified; it is now 2.2 KB). Both `geo` and `names` now read generated subsets (`addressTemplates.json`, `honorificTitles.json`).
