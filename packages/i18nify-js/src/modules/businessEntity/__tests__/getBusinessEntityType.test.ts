import getBusinessEntityType from '../getBusinessEntityType';
import { BusinessEntityData } from '../types';

const MOCK_DATA: BusinessEntityData = {
  business_entity_information: {
    categories: [],
    sub_categories: {},
    entity_types: {
      IN: [
        {
          code: 'PRIVATE_LIMITED',
          name: 'Private Limited Company',
          abbreviation: 'Pvt Ltd',
          category: 'CORPORATION',
          description: 'Pvt Ltd.',
        },
        {
          code: 'LLP',
          name: 'Limited Liability Partnership',
          abbreviation: 'LLP',
          category: 'PARTNERSHIP',
          description: 'LLP.',
        },
        {
          code: 'SOLE_PROPRIETORSHIP',
          name: 'Sole Proprietorship',
          abbreviation: '',
          category: 'SOLE_PROPRIETORSHIP',
          description: 'Sole prop.',
        },
      ],
      US: [
        {
          code: 'LLC',
          name: 'Limited Liability Company',
          abbreviation: 'LLC',
          category: 'LIMITED_LIABILITY',
          description: 'LLC.',
        },
        {
          code: 'C_CORPORATION',
          name: 'C Corporation',
          abbreviation: 'Corp',
          category: 'CORPORATION',
          description: 'C Corp.',
        },
      ],
    },
  },
};

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn((url: RequestInfo | URL) =>
    url.toString().includes('categories_data')
      ? Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ categories: [], sub_categories: {} }),
        } as Response)
      : Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              entity_types: MOCK_DATA.business_entity_information.entity_types,
            }),
        } as Response),
  );
});

describe('getBusinessEntityType', () => {
  it('returns entity types for India (IN)', async () => {
    const types = await getBusinessEntityType('IN');
    expect(types).toHaveLength(3);
    const codes = types.map((t) => t.code);
    expect(codes).toContain('PRIVATE_LIMITED');
    expect(codes).toContain('LLP');
    expect(codes).toContain('SOLE_PROPRIETORSHIP');
  });

  it('returns entity types for United States (US)', async () => {
    const types = await getBusinessEntityType('US');
    expect(types).toHaveLength(2);
    const codes = types.map((t) => t.code);
    expect(codes).toContain('LLC');
    expect(codes).toContain('C_CORPORATION');
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
      expect(typeof et.category).toBe('string');
      expect(et.category.length).toBeGreaterThan(0);
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
