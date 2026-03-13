# i18nify-js Architecture

## Module Map

Source: `packages/i18nify-js/src/modules/`

| Module | Exported from | Functions |
|---|---|---|
| `core` | `@razorpay/i18nify-js/core` | `getState`, `setState`, `resetState` |
| `currency` | `@razorpay/i18nify-js/currency` | `formatNumber`, `formatNumberByParts`, `getCurrencyList`, `getCurrencySymbol`, `convertToMajorUnit`, `convertToMinorUnit` |
| `phoneNumber` | `@razorpay/i18nify-js/phoneNumber` | `isValidPhoneNumber`, `formatPhoneNumber`, `parsePhoneNumber`, `getDialCodes`, `getDialCodeByCountryCode`, `getMaskedPhoneNumber` |
| `dateTime` | `@razorpay/i18nify-js/dateTime` | `formatDateTime`, `getRelativeTime`, `getWeekdays`, `parseDateTime` |
| `geo` | `@razorpay/i18nify-js/geo` | See `agent_docs/geo-banking.md` |
| `banking` | `@razorpay/i18nify-js/banking` | `getListOfBanks` |
| `types` | `@razorpay/i18nify-js/types` | `CountryCodeType`, `CurrencyCodeType`, `GetFlagReturnType` |
| `.internal` | Not exported | State singleton, locale resolution, Intl helpers |

The `.internal/` directory is excluded from the Rollup build (filtered by leading dot).

## Global State

Singleton: `packages/i18nify-js/src/modules/.internal/state/index.ts`

State shape: `packages/i18nify-js/src/modules/.internal/state/types.ts:1` — `{locale, direction, country}`, all default to empty strings.

Locale resolution order in every formatting function:
1. `options.locale` (call-site override)
2. `state.getState().locale` (global `setState`)
3. `window.navigator.languages[0]` (browser)
4. `'en-IN'` (Node.js fallback)

See implementation: `packages/i18nify-js/src/modules/.internal/utils/getLocale.ts:1`

## Error Handling Pattern

Every exported function is wrapped with `withErrorBoundary`:
`packages/i18nify-js/src/common/errorBoundary/index.ts`

- Catches errors, logs via `console.error`, re-throws as `I18nifyError`
- `I18nifyError` extends `Error` with `.timestamp`
- **All new exported functions must use this wrapper**

## Adding a New Module

1. Create `src/modules/{moduleName}/index.ts` — Rollup auto-discovers all non-hidden dirs
2. Export from `src/index.ts`
3. Add to `EXPORT_MODULES` in `scripts/generate-root-imports.js` (for React Native compat)
4. Add entry to `package.json` `exports` and `typesVersions`

## Adding a New Function to an Existing Module

1. Create the function file, wrap default export with `withErrorBoundary<typeof fn>(fn)`
2. Re-export from the module's `index.ts`

## Tests

- Unit: `*.test.ts` files inside `__tests__/` — run with Jest (`jsdom` environment)
- Browser: `*.spec.ts` files — run with Playwright across Chrome, Firefox, Safari, Edge
- Alias `#/i18nify-data/*` maps to `../../i18nify-data/*` in both Jest (`moduleNameMapper`) and Rollup (`alias` plugin)

Run unit tests: `yarn workspace @razorpay/i18nify-js run test`
Run browser tests: `yarn workspace @razorpay/i18nify-js run test:browser`

## React Package Commands

```
yarn build-react                                    # builds i18nify-js first, then react
yarn workspace @razorpay/i18nify-react run validate # tsc + lint
```

## Release Workflow

```
yarn changeset version   # apply pending changesets (bumps versions + updates CHANGELOGs)
yarn release             # publish to GitHub registry
yarn publish-npm         # publish to npm
```
