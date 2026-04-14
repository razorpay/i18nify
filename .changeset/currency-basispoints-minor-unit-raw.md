---
"@razorpay/i18nify-js": minor
---

Add `convertBasisPointsToPercent`, `convertPercentToBasisPoints`, and `getMinorUnitRawString` to the currency module.

- `convertBasisPointsToPercent(basisPoints)` — converts basis points to a percentage (250 bps → 2.5)
- `convertPercentToBasisPoints(percent)` — inverse conversion (2.5 → 250 bps)
- `getMinorUnitRawString(amount, { currency })` — returns the minor-unit value as a plain numeric string with no locale formatting, symbol, or grouping separators; intended for proto/XML protocol boundaries
