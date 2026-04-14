# i18nify

## Why

Razorpay operates across multiple countries and currencies. Products built on Razorpay need to handle locale-aware formatting, country-specific phone numbers, geographic data, and banking identifiers without each team building their own solutions. i18nify centralizes this — a single source of truth for i18n data and utilities, shared across JavaScript, React, and Go codebases.

## What

A monorepo providing internationalization primitives: currency formatting and conversion, phone number validation and masking, date/time formatting, country metadata, geographic subdivisions (states/cities/zipcodes), flag assets, and banking identifiers. Backed by a canonical JSON dataset (`i18nify-data`) consumed by all language packages.

## Repo Structure

Yarn monorepo (`yarn workspaces`). Three packages + one central dataset:

| Path | Package | Purpose |
|---|---|---|
| `packages/i18nify-js/` | `@razorpay/i18nify-js` | Core JS/TS library |
| `packages/i18nify-react/` | `@razorpay/i18nify-react` | React context provider wrapping i18nify-js |
| `packages/i18nify-go/` | Go module | Go implementation |
| `i18nify-data/` | — | Canonical JSON dataset (source of truth for all packages) |

## Architecture

```
i18nify-data/ (canonical JSON)
      │
      ├── Pre-build (JS): scripts/jsonSubsets/ strips large JSONs into minimal
      │   bundled subsets committed to src/modules/{module}/data/*.json
      │
      ├── Runtime (JS): geo/banking functions fetch directly from GitHub raw CDN
      │   at https://raw.githubusercontent.com/razorpay/i18nify/master/i18nify-data
      │
      └── Compile-time (Go): //go:embed bundles JSON files into the binary
```

## Key Constraint

Subdivision and banking data (states, cities, zipcodes, banks) is only available for **IN, MY, SG, US**. All world countries are supported for metadata and flags.

## Commands

```
yarn workspace @razorpay/i18nify-js run build    # full build (runs prebuild first)
yarn workspace @razorpay/i18nify-js run test     # Jest unit tests
yarn workspace @razorpay/i18nify-js run validate # tsc + lint
yarn validate                                    # validates all packages
```

**Any PR that changes `i18nify-js` or `i18nify-react` must include a changeset:**
```
yarn changeset   # interactive: select package, bump type, describe change
```

For package-specific commands (React, data validation, releases) see the relevant agent doc.

## Agent Docs

Before working on a specific area, read the relevant doc:

- `agent_docs/js-architecture.md` — i18nify-js module internals, data flow, error handling patterns
- `agent_docs/data-pipeline.md` — how i18nify-data feeds into bundled JS subsets; how to add/update data
- `agent_docs/geo-banking.md` — geo and banking module details; remote fetch pattern; supported countries
- `agent_docs/go-package.md` — i18nify-go structure, embed pattern, caching, bank identifier types
