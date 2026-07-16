import getBusinessEntityType from '../getBusinessEntityType';
import { BusinessEntityData } from '../types';

// Mock data mirrors the GLEIF ISO 20275 ELF shape (no category/description).
const MOCK_DATA: BusinessEntityData = {
  business_entity_information: {
    categories: [],
    sub_categories: {},
    entity_types: {
      IN: [
        {
          code: '2DVA',
          name: 'Cooperative Society',
          abbreviation: '',
          transliterated_name: 'Cooperative Society',
          language: 'en',
        },
        {
          code: '180P',
          name: 'Stand Alone Primary Dealer',
          abbreviation: '',
          transliterated_name: 'Stand Alone Primary Dealer',
          language: 'en',
        },
        {
          code: 'B6ES',
          name: 'Private Limited Company',
          abbreviation: 'Pvt Ltd',
          transliterated_name: 'Private Limited Company',
          language: 'en',
        },
      ],
      US: [
        {
          code: '14OD',
          name: 'credit union',
          abbreviation: '',
          transliterated_name: 'credit union',
          language: 'en',
        },
        {
          code: 'ZQHY',
          name: 'Limited Liability Company',
          abbreviation: 'LLC',
          transliterated_name: 'Limited Liability Company',
          language: 'en',
        },
      ],
    },
  },
};

// Stored JSON wraps each map value in { items: [...] } to satisfy the proto3
// schema; the loader unwraps it back to arrays.
const wrapItems = <T>(m: Record<string, T[]>): Record<string, { items: T[] }> =>
  Object.keys(m).reduce(
    (acc, k) => ({ ...acc, [k]: { items: m[k] } }),
    {} as Record<string, { items: T[] }>,
  );

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          categories: MOCK_DATA.business_entity_information.categories,
          sub_categories: wrapItems(
            MOCK_DATA.business_entity_information.sub_categories,
          ),
          entity_types: wrapItems(
            MOCK_DATA.business_entity_information.entity_types,
          ),
        }),
    } as Response),
  );
});

describe('getBusinessEntityType', () => {
  it('returns entity types for India (IN)', async () => {
    const types = await getBusinessEntityType('IN');
    expect(types).toHaveLength(3);
    const codes = types.map((t) => t.code);
    expect(codes).toContain('2DVA');
    expect(codes).toContain('180P');
  });

  it('returns entity types for United States (US)', async () => {
    const types = await getBusinessEntityType('US');
    expect(types).toHaveLength(2);
    const codes = types.map((t) => t.code);
    expect(codes).toContain('14OD');
  });

  it('is case-insensitive (lowercase input)', async () => {
    const types = await getBusinessEntityType('in');
    expect(types).toHaveLength(3);
  });

  it('trims surrounding whitespace', async () => {
    const types = await getBusinessEntityType('  US  ');
    expect(types).toHaveLength(2);
  });

  it('each entity type has required fields', async () => {
    const types = await getBusinessEntityType('IN');
    for (const et of types) {
      expect(typeof et.code).toBe('string');
      expect(et.code.length).toBeGreaterThan(0);
      expect(typeof et.name).toBe('string');
      expect(et.name.length).toBeGreaterThan(0);
      expect(typeof et.transliterated_name).toBe('string');
      expect(typeof et.language).toBe('string');
    }
  });

  it('throws for empty country code', async () => {
    await expect(getBusinessEntityType('')).rejects.toThrow('empty');
  });

  it('throws for unsupported country code', async () => {
    await expect(getBusinessEntityType('ZZ')).rejects.toThrow(
      'No entity types found for country code',
    );
  });

  it('throws when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    await expect(getBusinessEntityType('IN')).rejects.toThrow();
  });

  it('throws when HTTP response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500 } as Response),
    );
    await expect(getBusinessEntityType('IN')).rejects.toThrow();
  });
});
