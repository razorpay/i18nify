# Plan: i18nify-cli — New CLI Package

## Context

The i18nify monorepo currently has JS, React, and Go packages. This adds `packages/i18nify-cli` — a developer-facing CLI tool available via `npx @razorpay/i18nify-cli` (binary: `i18n`) — that wraps existing `@razorpay/i18nify-js` functions. The core design constraint is **plug-and-play extensibility**: adding a new command requires only creating one file + one import line — no core changes.

Starting with the `phone` command group and 2 commands. More groups (currency, dateTime, geo, banking) will be added incrementally.

---

## Architecture

### Plug-and-Play Module System

```
src/index.ts  →  registry.ts  →  commands/{group}/index.ts  →  commands/{group}/{leaf}.ts
```

- **New group**: create `commands/newGroup/index.ts` + one import + one array entry in `registry.ts`
- **New leaf command**: create the leaf file + one import + one array entry in the group's `index.ts`

### `CommandModule` Interface (`src/types.ts`)

```typescript
import { Command } from 'commander';

export interface CommandModule {
  name: string;
  description: string;
  register(parent: Command): void;
}
```

### `registry.ts` (only file touched when adding a top-level group)

```typescript
import phone from './commands/phone/index';
// one import per new group

const commandModules: CommandModule[] = [phone];

export function registerAllCommands(program: Command): void {
  commandModules.forEach((mod) => mod.register(program));
}
```

---

## Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| CLI framework | `commander` v12 | Lightweight, native subcommand nesting, great TS support |
| Bundler | `esbuild` | Single-file CJS output; Rollup's multi-format is irrelevant for a CLI |
| Type-check | `tsc --noEmit` | Matches existing pattern in i18nify-js |
| Shebang | `esbuild --banner:js` | esbuild strips shebangs from source; banner injects it correctly into dist |
| Node minimum | 18.0.0 | Keeps options open for async fetch-based commands later |
| i18nify-js dep | `"*"` | Yarn v1 workspace protocol — `workspace:` is Yarn 2+ only; `"*"` resolves to the local workspace |

---

## Package Structure

```
packages/i18nify-cli/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                   # Entry: Node version guard + Commander program + registerAllCommands
    ├── types.ts                   # CommandModule interface
    ├── registry.ts                # Imports and registers all top-level groups
    ├── output.ts                  # renderOutput(value, json?)
    ├── errors.ts                  # handleError(err): never
    └── commands/
        └── phone/
            ├── index.ts           # Group module — wires dial + gen onto 'phone' subcommand
            ├── dial.ts            # i18n phone dial <country>
            └── gen.ts             # i18n phone gen <country>
```

> Future groups slot in as new directories under `commands/` with zero changes to core files.

---

## Key File Details

### `package.json`

```json
{
  "name": "@razorpay/i18nify-cli",
  "version": "0.1.0",
  "bin": { "i18n": "./dist/index.js" },
  "files": ["dist"],
  "engines": { "node": ">=18.0.0" },
  "scripts": {
    "build": "rm -rf dist && esbuild src/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --format=cjs --banner:js='#!/usr/bin/env node'",
    "postbuild": "node -e \"require('fs').chmodSync('dist/index.js', '755')\"",
    "validate": "tsc --noEmit && eslint src",
    "test": "jest"
  },
  "dependencies": {
    "@razorpay/i18nify-js": "*",
    "commander": "^12.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "esbuild": "^0.21.0",
    "typescript": "^5.2.2"
  }
}
```

### `tsconfig.json`

No `rootDir` — intentionally omitted so TypeScript can resolve the relative JSON import from i18nify-js source without restriction (we use `noEmit: true` so `rootDir` serves no purpose).

### `phoneFormatterMapper.json` import

Both `dial.ts` and `gen.ts` use a relative path:

```typescript
import phoneFormatterMapper from '../../../../i18nify-js/src/modules/phoneNumber/data/phoneFormatterMapper.json';
```

esbuild inlines it at build time. **i18nify-js must be built before the CLI** (`yarn build-js` first).

---

## UX

Binary: `i18n`. Country is a **positional argument**, normalized to uppercase internally. Flags are optional output modifiers.

```bash
i18n phone dial IN          # +91
i18n phone dial us          # +1   (case-insensitive)
i18n phone dial IN --json   # "+91"

i18n phone gen IN           # +91 98765 43210
i18n phone gen us --raw     # +19876543210   (no spaces)
i18n phone gen SG --json    # "+65 8123 4567"
```

---

## Input Validation

Driven by actual keys of `phoneFormatterMapper.json` — handles standard 2-letter codes and hyphenated sub-regions (`YT-UNF`, `GB-ENG`, etc.).

```
input → toUpperCase() → key in phoneFormatterMapper?
  NO  → Error: "<input>" is not a supported country code.
  YES → (gen only) format string non-empty?
          NO  → Error: No phone number format available for "<COUNTRY>".
          YES → proceed
```

Missing positional arg → commander's built-in error fires automatically.

---

## `gen` Logic

1. Normalize country to uppercase
2. Validate key exists in `phoneFormatterMapper` — error if not
3. Validate format string is non-empty — error if not
4. `getDialCodeByCountryCode(country)` → dial code
5. Replace each `x` in format template with random digit (first digit 1–9, rest 0–9)
6. Validate with `isValidPhoneNumber(candidate, country)` — retry up to 5×
7. If all retries fail → `Error: Could not generate a valid phone number for "<COUNTRY>". Try again.`
8. Apply `--raw` (strip spaces) or `--json` as needed

---

## Output & Errors

**`output.ts`**: primitives → plain text; objects/arrays → JSON 2-space indent; `--json` forces JSON for primitives too.

**`errors.ts`**: `handleError(err): never` — clean message to stderr + `process.exit(1)`. `I18NIFY_CLI_DEBUG=1` prints full stack. Strips `[i18nify Error]:` prefix from i18nify-js errors.

---

## Root-Level Changes

### `package.json` (root)
- Added `"build-cli": "yarn workspace @razorpay/i18nify-cli run build"`
- Extended `validate` to include `@razorpay/i18nify-cli`

### `scripts/publishToNpm.js`
- Added `npm publish --access public` block for `packages/i18nify-cli`

### `.changeset/config.json` — no change (auto-discovers all `packages/*`)

---

## Build Order

```bash
yarn build-js    # must run first — CLI resolves @razorpay/i18nify-js from its compiled lib/
yarn build-cli   # bundles CLI into dist/index.js (~155kb)
```

---

## Verification

```bash
# Build
yarn build-js && yarn build-cli

# dial — valid inputs (case-insensitive)
node packages/i18nify-cli/dist/index.js phone dial IN
node packages/i18nify-cli/dist/index.js phone dial us
node packages/i18nify-cli/dist/index.js phone dial Sg --json

# dial — error cases
node packages/i18nify-cli/dist/index.js phone dial XY       # unsupported code
node packages/i18nify-cli/dist/index.js phone dial          # missing arg

# gen — valid inputs
node packages/i18nify-cli/dist/index.js phone gen IN
node packages/i18nify-cli/dist/index.js phone gen us --raw
node packages/i18nify-cli/dist/index.js phone gen SG --json

# gen — error cases
node packages/i18nify-cli/dist/index.js phone gen BQ-BO    # empty format string
node packages/i18nify-cli/dist/index.js phone gen XY       # unsupported code

# Help
node packages/i18nify-cli/dist/index.js --help
node packages/i18nify-cli/dist/index.js phone --help
node packages/i18nify-cli/dist/index.js phone dial --help
node packages/i18nify-cli/dist/index.js phone gen --help
```
