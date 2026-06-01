import getHonorificTitles from '../getHonorificTitles';
import { NamesData } from '../types';

const MOCK_DATA: NamesData = {
  names_information: {
    honorific_titles: {
      english: [
        {
          code: 'MR',
          title: 'Mr.',
          gender: 'male',
          description: 'Title for men',
        },
        {
          code: 'MRS',
          title: 'Mrs.',
          gender: 'female',
          description: 'Title for married women',
        },
        {
          code: 'DR',
          title: 'Dr.',
          gender: 'neutral',
          description: 'Title for doctors',
        },
      ],
      hindi: [
        {
          code: 'SHRI',
          title: 'Shri',
          gender: 'male',
          description: 'Respectful title for men',
        },
        {
          code: 'SMT',
          title: 'Smt.',
          gender: 'female',
          description: 'Respectful title for married women',
        },
      ],
      french: [
        {
          code: 'M',
          title: 'M.',
          gender: 'male',
          description: 'Title for men',
        },
        {
          code: 'MME',
          title: 'Mme',
          gender: 'female',
          description: 'Title for women',
        },
      ],
    },
    validation_rules: { min_length: 2, max_length: 100 },
  },
};

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(MOCK_DATA),
    } as Response),
  );
});

describe('getHonorificTitles', () => {
  it('returns titles for English (en)', async () => {
    const titles = await getHonorificTitles('en');
    expect(titles).toHaveLength(3);
    const codes = titles.map((t) => t.code);
    expect(codes).toContain('MR');
    expect(codes).toContain('MRS');
    expect(codes).toContain('DR');
  });

  it('returns titles for Hindi (hi)', async () => {
    const titles = await getHonorificTitles('hi');
    expect(titles).toHaveLength(2);
    const codes = titles.map((t) => t.code);
    expect(codes).toContain('SHRI');
    expect(codes).toContain('SMT');
  });

  it('returns titles for French (fr)', async () => {
    const titles = await getHonorificTitles('fr');
    expect(titles).toHaveLength(2);
  });

  it('is case-insensitive (uppercase locale)', async () => {
    const titles = await getHonorificTitles('EN');
    expect(titles).toHaveLength(3);
  });

  it('strips BCP 47 region subtag (en-US → en)', async () => {
    const enUS = await getHonorificTitles('en-US');
    const en = await getHonorificTitles('en');
    expect(enUS).toEqual(en);
  });

  it('trims surrounding whitespace', async () => {
    const titles = await getHonorificTitles('  en  ');
    expect(titles).toHaveLength(3);
  });

  it('each title has code, title, gender, and description', async () => {
    const titles = await getHonorificTitles('en');
    for (const t of titles) {
      expect(typeof t.code).toBe('string');
      expect(t.code.length).toBeGreaterThan(0);
      expect(typeof t.title).toBe('string');
      expect(t.title.length).toBeGreaterThan(0);
      expect(['male', 'female', 'neutral']).toContain(t.gender);
    }
  });

  it('throws for empty locale', async () => {
    await expect(getHonorificTitles('')).rejects.toThrow('empty');
  });

  it('throws for unsupported locale', async () => {
    await expect(getHonorificTitles('zz')).rejects.toThrow(
      'No honorific titles found for locale',
    );
  });

  it('throws when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    await expect(getHonorificTitles('en')).rejects.toThrow();
  });

  it('throws when HTTP response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 503 } as Response),
    );
    await expect(getHonorificTitles('en')).rejects.toThrow();
  });
});
