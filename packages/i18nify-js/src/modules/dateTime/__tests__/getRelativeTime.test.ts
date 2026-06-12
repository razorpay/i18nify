import { getRelativeTime } from '../index';

describe('dateTime - getRelativeTime', () => {
  const now = new Date();

  test('returns correct relative time for seconds', () => {
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
    expect(getRelativeTime(thirtySecondsAgo)).toBe('30 seconds ago');
    const inThirtySeconds = new Date(now.getTime() + 30 * 1000);
    expect(getRelativeTime(inThirtySeconds)).toBe('in 30 seconds');
  });

  test('returns correct relative time for minutes', () => {
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);
    expect(getRelativeTime(inFiveMinutes)).toBe('in 5 minutes');
  });

  test('returns correct relative time for hours', () => {
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(getRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    expect(getRelativeTime(inTwoHours)).toBe('in 2 hours');
  });

  test('returns correct relative time for days', () => {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(threeDaysAgo)).toBe('3 days ago');
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(inThreeDays)).toBe('in 3 days');
  });

  test('returns correct relative time for days for undefined options', () => {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(threeDaysAgo, undefined)).toBe('3 days ago');
  });

  test('handles different locales', () => {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(getRelativeTime(oneDayAgo, { locale: 'en-US' })).toBe('1 day ago');
    expect(getRelativeTime(oneDayAgo, { locale: 'fr-FR' })).toBe(
      'il y a 1 jour',
    );
  });

  test('throws an error for invalid date inputs', () => {
    expect(() => getRelativeTime('invalid-date')).toThrow(
      'Date format not recognized',
    );
  });

  test('throws a generic error message for invalid intl options', () => {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(() =>
      getRelativeTime(new Date(), {
        locale: 'en-US',
        intlOptions: { style: 'dummy' } as any,
        baseDate: oneDayAgo,
      }),
    ).toThrow(
      'Error: An error occurred while creating the RelativeTimeFormat instance: Value dummy out of range for Intl.RelativeTimeFormat options property style. Please ensure the provided options are valid and try again.',
    );
  });

  test('handles non-Error instance in catch block', () => {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    // Create a custom error that's not an instance of Error
    const customError = { message: 'custom error' };

    // Mock the Intl.RelativeTimeFormat constructor to throw our custom error
    const originalRTF = Intl.RelativeTimeFormat;
    (Intl as any).RelativeTimeFormat = class {
      constructor() {
        throw customError;
      }
    };

    expect(() =>
      getRelativeTime(new Date(), {
        locale: 'en-US',
        baseDate: oneDayAgo,
      }),
    ).toThrow('An unknown error occurred. Error details: [object Object]');

    // Restore original implementation
    (Intl as any).RelativeTimeFormat = originalRTF;
  });

  test('returns correct relative time for weeks', () => {
    const twoWeeksAgo = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(twoWeeksAgo)).toBe('2 weeks ago');
    const inTwoWeeks = new Date(now.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(inTwoWeeks)).toBe('in 2 weeks');
  });

  test('returns correct relative time for months', () => {
    const threeMonthsAgo = new Date(
      now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000,
    );
    expect(getRelativeTime(threeMonthsAgo)).toBe('3 months ago');
    const inThreeMonths = new Date(
      now.getTime() + 3 * 30 * 24 * 60 * 60 * 1000,
    );
    expect(getRelativeTime(inThreeMonths)).toBe('in 3 months');
  });

  test('returns correct relative time for years', () => {
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(oneYearAgo)).toBe('1 year ago');
    const inOneYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(inOneYear)).toBe('in 12 months');
  });
});
