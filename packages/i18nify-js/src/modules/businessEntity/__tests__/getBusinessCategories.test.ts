import getBusinessCategories from '../getBusinessCategories';
import { BusinessEntityData } from '../types';

const MOCK_DATA: BusinessEntityData = {
  business_entity_information: {
    categories: [
      {
        code: 'CORPORATION',
        name: 'Corporation',
        description: 'A legal entity.',
      },
      {
        code: 'PARTNERSHIP',
        name: 'Partnership',
        description: 'Two or more individuals.',
      },
    ],
    sub_categories: {
      CORPORATION: [
        {
          code: 'C_CORPORATION',
          name: 'C Corporation',
          description: 'Standard corp.',
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
    entity_types: {
      IN: [
        {
          code: 'B6ES',
          name: 'Private Limited Company',
          abbreviation: 'Pvt Ltd',
          transliterated_name: 'Private Limited Company',
          language: 'en',
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
          json: () =>
            Promise.resolve({
              categories: MOCK_DATA.business_entity_information.categories,
              sub_categories:
                MOCK_DATA.business_entity_information.sub_categories,
            }),
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

describe('getBusinessCategories', () => {
  it('returns all categories from the data source', async () => {
    const cats = await getBusinessCategories();
    expect(cats).toHaveLength(2);
    expect(cats[0].code).toBe('CORPORATION');
    expect(cats[1].code).toBe('PARTNERSHIP');
  });

  it('each category has code, name, and description', async () => {
    const cats = await getBusinessCategories();
    for (const cat of cats) {
      expect(typeof cat.code).toBe('string');
      expect(cat.code.length).toBeGreaterThan(0);
      expect(typeof cat.name).toBe('string');
      expect(cat.name.length).toBeGreaterThan(0);
      expect(typeof cat.description).toBe('string');
    }
  });

  it('throws when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    await expect(getBusinessCategories()).rejects.toThrow();
  });

  it('throws when HTTP response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 404 } as Response),
    );
    await expect(getBusinessCategories()).rejects.toThrow();
  });
});
