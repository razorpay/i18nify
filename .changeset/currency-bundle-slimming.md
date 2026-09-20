---
'@razorpay/i18nify-js': minor
---

perf(currency): stop bundling the full currency dataset twice and make the package tree-shakeable

- `getDenomination` and `getISONumericCode` now read generated subsets (`denominations.json`, `numericCodes.json`) instead of the full `i18nify-data` file
- `INTL_MAPPING` holds literal symbols so formatters no longer pull the whole currency table
- every utility is exported as `/*#__PURE__*/ withErrorBoundary(fn)` and `package.json` declares `"sideEffects": false`
- CommonJS output is emitted per module, so `require('@razorpay/i18nify-js/<module>')` no longer loads the entire library
- `withErrorBoundary` no longer calls `console.error`; the original error is attached to `I18nifyError` as `cause`, and `message` is the original message (it was previously prefixed with `Error: ` by accident)
- `getCurrencyList` returns a copy instead of the library's internal table
