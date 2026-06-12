import formatFromUnix from '../formatFromUnix';

jest.mock('@internationalized/date', () => ({
  DateFormatter: jest
    .fn()
    .mockImplementation(
      (locale: string, options: Intl.DateTimeFormatOptions) => ({
        format: jest.fn().mockImplementation((date: Date) => {
          const formatter = new Intl.DateTimeFormat(locale, options);
          return formatter.format(new Date(date));
        }),
      }),
    ),
}));

const normalize = (value: string) => value.replace(/\s+/g, ' ');

describe('formatFromUnix', () => {
  it('formats Unix 0 in UTC as en-US datetime', () => {
    const result = formatFromUnix(0, { timezone: 'UTC', locale: 'en-US' });
    expect(normalize(result)).toBe('1/1/1970, 12:00:00 AM');
  });

  it('shifts time when timezone is behind UTC', () => {
    const result = formatFromUnix(0, {
      timezone: 'America/New_York',
      locale: 'en-US',
    });
    expect(normalize(result)).toBe('12/31/1969, 7:00:00 PM');
  });

  it('honours custom intlOptions', () => {
    const result = formatFromUnix(1609459200, {
      timezone: 'UTC',
      locale: 'en-US',
      intlOptions: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
    });
    expect(normalize(result)).toBe('1/1/2021');
  });

  it('throws for non-finite timestamps', () => {
    expect(() => formatFromUnix(NaN, { timezone: 'UTC' })).toThrow(
      /Invalid Unix timestamp/,
    );
  });

  it('throws when timezone is invalid', () => {
    expect(() => formatFromUnix(0, { timezone: 'Not/A/Timezone' })).toThrow();
  });
});
