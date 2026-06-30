import getBusinessSubCategories from '../getBusinessSubCategories';
import { BusinessEntityData } from '../types';

const MOCK_DATA: BusinessEntityData = {
  business_entity_information: {
    categories: [
      { code: 'CORPORATION', name: 'Corporation', description: '' },
      { code: 'PARTNERSHIP', name: 'Partnership', description: '' },
    ],
    sub_categories: {
      CORPORATION: [
        {
          code: 'C_CORPORATION',
          name: 'C Corporation',
          description: 'Standard corp.',
        },
        {
          code: 'S_CORPORATION',
          name: 'S Corporation',
          description: 'Pass-through.',
        },
      ],
      PARTNERSHIP: [
        {
          code: 'GENERAL_PARTNERSHIP',
          name: 'General Partnership',
          description: 'Equal partners.',
        },
      ],
    },
    entity_types: {},
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

describe('getBusinessSubCategories', () => {
  it('returns sub-categories for a known category code', async () => {
    const subs = await getBusinessSubCategories('CORPORATION');
    expect(subs).toHaveLength(2);
    expect(subs[0].code).toBe('C_CORPORATION');
    expect(subs[1].code).toBe('S_CORPORATION');
  });

  it('is case-insensitive (lowercase input)', async () => {
    const subs = await getBusinessSubCategories('corporation');
    expect(subs).toHaveLength(2);
  });

  it('trims surrounding whitespace', async () => {
    const subs = await getBusinessSubCategories('  CORPORATION  ');
    expect(subs).toHaveLength(2);
  });

  it('returns different sub-categories for different parent codes', async () => {
    const corpSubs = await getBusinessSubCategories('CORPORATION');
    const partnerSubs = await getBusinessSubCategories('PARTNERSHIP');
    expect(corpSubs).not.toEqual(partnerSubs);
    expect(partnerSubs[0].code).toBe('GENERAL_PARTNERSHIP');
  });

  it('throws for empty category code', async () => {
    await expect(getBusinessSubCategories('')).rejects.toThrow('empty');
  });

  it('throws for unknown category code', async () => {
    await expect(getBusinessSubCategories('UNKNOWN_CODE')).rejects.toThrow(
      'Unknown category code',
    );
  });

  it('throws when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    await expect(getBusinessSubCategories('CORPORATION')).rejects.toThrow();
  });
});
