/**
 * Updates `i18nify-data/currency/data.json` from the latest ISO 4217 list.
 *
 * Source: "List One" (current currencies & funds) published by the ISO 4217
 * maintenance agency, SIX Group. It is the authoritative, always-current
 * feed, so no npm package (which would lag behind ISO amendments) is needed.
 *
 * ISO-owned fields are refreshed on every run:
 *   name, numeric_code, minor_unit
 *
 * Curated fields are preserved from the existing entry (ISO defines none):
 *   symbol, symbol_position, physical_currency_denominations
 *   (and any other key already present on the entry)
 *
 * Rules:
 * - Codes with no minor unit ("N.A.": precious metals, bond-market units,
 *   SDR, testing/no-currency codes) are never added.
 * - Fund codes (`IsFund="true"`) are not added, but existing ones are kept.
 * - Codes withdrawn by ISO are kept and reported; pass `--prune` to drop them.
 * - New currencies get a best-effort symbol/position from `Intl` and an empty
 *   denominations list; each is reported so the data can be curated.
 * - Existing entries keep their position in the file; new codes are appended.
 *
 * Usage:
 *   yarn update-currency-data [--dry-run] [--prune] [--source <url|file>]
 *
 *   --dry-run          report changes without writing data.json
 *   --prune            remove codes no longer present in the ISO list
 *   --source <path>    read the ISO XML from a local file or another URL
 *
 * After running: regenerate the JS subsets and validate the data (see
 * agent_docs/data-pipeline.md, "Adding/Updating Currency Data").
 */

const fs = require('fs');
const path = require('path');

const ISO_4217_LIST_ONE_URL =
  'https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml';

const DATA_PATH = path.join(
  __dirname,
  '..',
  'i18nify-data',
  'currency',
  'data.json',
);

const ROOT_KEY = 'currency_information';

function parseArgs(argv) {
  const args = { dryRun: false, prune: false, source: ISO_4217_LIST_ONE_URL };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--prune') {
      args.prune = true;
    } else if (arg === '--source') {
      args.source = argv[++i];
      if (!args.source) {
        throw new Error('--source requires a value');
      }
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return args;
}

async function loadXml(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(
        `failed to fetch ${source}: ${response.status} ${response.statusText}`,
      );
    }
    return response.text();
  }
  return fs.readFileSync(source, 'utf8');
}

const XML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
};

function decodeXml(text) {
  return text.replace(
    /&(?:amp|lt|gt|quot|apos|#(\d+)|#x([0-9a-fA-F]+));/g,
    (match, dec, hex) => {
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      return XML_ENTITIES[match];
    },
  );
}

/**
 * Returns the text and attributes of the first `<tag>` inside `xml`,
 * or null when the tag is absent (e.g. "No universal currency" entries).
 */
function readTag(xml, tag) {
  const match = new RegExp(`<${tag}(\\s[^>]*)?>([^<]*)</${tag}>`).exec(xml);
  if (!match) return null;
  return {
    text: decodeXml(match[2].trim()),
    isFund: /IsFund="true"/.test(match[1] ?? ''),
  };
}

/**
 * Parses the ISO 4217 List One XML into `{ published, currencies }` where
 * `currencies` maps code -> { name, numeric_code, minor_unit, isFund, countries }.
 * The list has one row per country, so a currency appears multiple times.
 */
function parseIso4217(xml) {
  const published = /<ISO_4217[^>]*\bPblshd="([^"]+)"/.exec(xml)?.[1];
  const currencies = {};
  const entryRegex = /<CcyNtry>([\s\S]*?)<\/CcyNtry>/g;

  let entry;
  while ((entry = entryRegex.exec(xml)) !== null) {
    const body = entry[1];
    const code = readTag(body, 'Ccy')?.text;
    if (!code) continue;

    const name = readTag(body, 'CcyNm');
    const country = readTag(body, 'CtryNm')?.text ?? '';

    if (!currencies[code]) {
      currencies[code] = {
        name: name?.text ?? '',
        numeric_code: readTag(body, 'CcyNbr')?.text ?? '',
        minor_unit: readTag(body, 'CcyMnrUnts')?.text ?? '',
        isFund: Boolean(name?.isFund),
        countries: [],
      };
    }
    currencies[code].countries.push(country);
  }

  if (Object.keys(currencies).length === 0) {
    throw new Error('no <CcyNtry> entries found; is the source the ISO XML?');
  }
  return { published, currencies };
}

/** Best-effort symbol for a new currency, via ICU. Falls back to the code. */
function guessSymbol(code) {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(1);
    const symbol = parts.find((part) => part.type === 'currency')?.value;
    if (symbol && symbol !== code) return symbol;
  } catch {
    // ICU does not know the code yet
  }
  return code;
}

/** "prefix" or "suffix" depending on where ICU places the symbol in `en`. */
function guessSymbolPosition(code) {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
    }).formatToParts(1);
    const symbolIndex = parts.findIndex((part) => part.type === 'currency');
    const integerIndex = parts.findIndex((part) => part.type === 'integer');
    if (symbolIndex > integerIndex) return 'suffix';
  } catch {
    // fall through to the default
  }
  return 'prefix';
}

function merge(existing, iso, { prune }) {
  const report = { added: [], updated: [], withdrawn: [], skipped: [] };
  const data = {};

  for (const [code, entry] of Object.entries(iso)) {
    const prev = existing[code];

    if (entry.minor_unit === 'N.A.') {
      report.skipped.push(`${code} (no minor unit)`);
      continue;
    }
    if (entry.isFund && !prev) {
      report.skipped.push(`${code} (fund)`);
      continue;
    }

    const isoFields = {
      name: entry.name,
      numeric_code: entry.numeric_code,
      minor_unit: entry.minor_unit,
    };

    if (prev) {
      const changes = Object.entries(isoFields)
        .filter(([key, value]) => prev[key] !== value)
        .map(
          ([key, value]) =>
            `${key}: ${JSON.stringify(prev[key])} -> ${JSON.stringify(value)}`,
        );
      if (changes.length) {
        report.updated.push(`${code}: ${changes.join(', ')}`);
      }
      // Spreading `prev` first keeps its key order and every curated field.
      data[code] = { ...prev, ...isoFields };
    } else {
      data[code] = {
        ...isoFields,
        symbol: guessSymbol(code),
        physical_currency_denominations: [],
        symbol_position: guessSymbolPosition(code),
      };
      report.added.push(
        `${code} (${entry.name}; ${entry.countries.join(', ')})`,
      );
    }
  }

  for (const code of Object.keys(existing)) {
    if (data[code]) continue;
    report.withdrawn.push(code);
    if (!prune) {
      data[code] = existing[code];
    }
  }

  // Keep the existing key order (small diffs); new codes go at the end in
  // ISO list order.
  const ordered = {};
  for (const code of Object.keys(existing)) {
    if (data[code]) ordered[code] = data[code];
  }
  for (const code of Object.keys(data)) {
    if (!ordered[code]) ordered[code] = data[code];
  }
  return { data: ordered, report };
}

function printList(label, items) {
  if (!items.length) return;
  console.log(`\n${label} (${items.length}):`);
  for (const item of items) {
    console.log(`  - ${item}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))[ROOT_KEY];
  if (!existing) {
    throw new Error(`${DATA_PATH} has no "${ROOT_KEY}" key`);
  }

  console.log(`Fetching ISO 4217 list from ${args.source}`);
  const { published, currencies } = parseIso4217(await loadXml(args.source));
  console.log(
    `ISO 4217 list published ${published ?? 'unknown'}: ${Object.keys(currencies).length} codes`,
  );

  const { data, report } = merge(existing, currencies, args);

  printList('Added (curate symbol and denominations)', report.added);
  printList('Updated', report.updated);
  printList(
    args.prune
      ? 'Removed (withdrawn by ISO)'
      : 'Withdrawn by ISO but kept (pass --prune to remove)',
    report.withdrawn,
  );
  printList('Skipped', report.skipped);

  const hasChanges =
    report.added.length ||
    report.updated.length ||
    (args.prune && report.withdrawn.length);

  console.log(
    `\n${ROOT_KEY}: ${Object.keys(existing).length} -> ${Object.keys(data).length} currencies`,
  );

  if (!hasChanges) {
    console.log('data.json is already up to date');
    return;
  }
  if (args.dryRun) {
    console.log('dry run: data.json not written');
    return;
  }

  fs.writeFileSync(
    DATA_PATH,
    JSON.stringify({ [ROOT_KEY]: data }, null, 2) + '\n',
  );
  console.log(`wrote ${path.relative(process.cwd(), DATA_PATH)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
