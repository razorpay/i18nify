import { getHonorificTitles } from '../index';

describe('names - getHonorificTitles', () => {
  it('returns English honorific titles for US', () => {
    const titles = getHonorificTitles('US');

    expect(titles.length).toBeGreaterThan(0);
    expect(titles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MR',
          title: 'Mr.',
          gender: 'male',
        }),
      ]),
    );
  });

  it('returns Hindi honorific titles for IN', () => {
    const titles = getHonorificTitles('IN');

    expect(titles.length).toBeGreaterThan(0);
    expect(titles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'SHRI',
          title: 'Shri',
          gender: 'male',
        }),
      ]),
    );
  });

  it('matches country code case-insensitively and trims whitespace', () => {
    expect(getHonorificTitles(' us ')).toEqual(getHonorificTitles('US'));
  });

  it('returns a copy of title entries', () => {
    const titles = getHonorificTitles('US');
    titles[0].title = 'Changed';

    expect(getHonorificTitles('US')[0].title).not.toBe('Changed');
  });

  it('throws for an empty country code', () => {
    expect(() => getHonorificTitles('')).toThrow(/countryCode/);
  });

  it('throws for an unsupported country code', () => {
    expect(() => getHonorificTitles('ZZ')).toThrow(/No honorific titles/);
  });
});
