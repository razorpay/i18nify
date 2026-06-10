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

const norm = (s: string) => s.replace(/\s+/g, ' ');

describe('formatFromUnix', () => {
  describe('basic formatting', () => {
    it('formats Unix 0 in UTC as en-US datetime', () => {
      const result = formatFromUnix(0, { timezone: 'UTC', locale: 'en-US' });
      expect(norm(result)).toBe('1/1/1970, 12:00:00 AM');
    });

    it('formats a modern timestamp in UTC', () => {
      // 1609459200 = 2021-01-01T00:00:00.000Z
      const result = formatFromUnix(1609459200, {
        timezone: 'UTC',
        locale: 'en-US',
      });
      expect(norm(result)).toBe('1/1/2021, 12:00:00 AM');
    });

    it('returns a string for any finite integer', () => {
      expect(typeof formatFromUnix(1700000000, { timezone: 'UTC' })).toBe(
        'string',
      );
    });
  });

  describe('timezone conversion', () => {
    it('shifts date when timezone is behind UTC (America/New_York)', () => {
      // Unix 0 in UTC = 1970-01-01 00:00:00 → EST (UTC-5) = 1969-12-31 19:00:00
      const result = formatFromUnix(0, {
        timezone: 'America/New_York',
        locale: 'en-US',
      });
      expect(norm(result)).toBe('12/31/1969, 7:00:00 PM');
    });

    it('shifts time ahead when timezone is ahead of UTC (Asia/Kolkata)', () => {
      // Unix 0 in UTC+5:30 = 1970-01-01 05:30:00 IST
      const result = formatFromUnix(0, {
        timezone: 'Asia/Kolkata',
        locale: 'en-US',
      });
      expect(norm(result)).toBe('1/1/1970, 5:30:00 AM');
    });

    it('produces different outputs for different timezones on the same timestamp', () => {
      const utc = formatFromUnix(1700000000, { timezone: 'UTC' });
      const ny = formatFromUnix(1700000000, { timezone: 'America/New_York' });
      expect(utc).not.toBe(ny);
    });
  });

  describe('custom intlOptions', () => {
    it('honours dateOnly via intlOptions', () => {
      const result = formatFromUnix(1609459200, {
        timezone: 'UTC',
        locale: 'en-US',
        intlOptions: {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        },
      });
      expect(norm(result)).toBe('1/1/2021');
    });

    it('honours 24-hour clock via intlOptions', () => {
      // 1609459200 = midnight UTC → 00:00:00 in 24h
      const result = formatFromUnix(1609459200, {
        timezone: 'UTC',
        locale: 'en-US',
        intlOptions: {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        },
      });
      expect(norm(result)).toBe('00:00:00');
    });

    it('explicit timezone in intlOptions is overridden by the timezone parameter', () => {
      const withParam = formatFromUnix(1609459200, {
        timezone: 'UTC',
        locale: 'en-US',
        intlOptions: {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        },
      });
      // timezone: 'UTC' must win → date stays 1/1/2021 not 12/31/2020
      expect(norm(withParam)).toBe('1/1/2021');
    });
  });

  describe('invalid inputs', () => {
    it.each([NaN, Infinity, -Infinity])(
      'throws for non-finite value %s',
      (ts) => {
        expect(() => formatFromUnix(ts, { timezone: 'UTC' })).toThrow(
          /Invalid Unix timestamp/,
        );
      },
    );

    it('throws when timezone is invalid', () => {
      expect(() => formatFromUnix(0, { timezone: 'Not/A/Timezone' })).toThrow();
    });
  });

  describe('negative timestamps (pre-1970)', () => {
    it('handles negative Unix timestamps', () => {
      // -1 = 1969-12-31T23:59:59 UTC
      const result = formatFromUnix(-1, {
        timezone: 'UTC',
        locale: 'en-US',
        intlOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
      });
      expect(norm(result)).toBe('12/31/1969');
    });
  });
});
