import getRelativeTime from '../getRelativeTime';

describe('dateTime - getRelativeTime', () => {
  const now = new Date();

  test('returns correct relative time for seconds', () => {
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
    expect(getRelativeTime(thirtySecondsAgo, now)).toBe('30 seconds ago');
    const inThirtySeconds = new Date(now.getTime() + 30 * 1000);
    expect(getRelativeTime(inThirtySeconds, now)).toBe('in 30 seconds');
  });

  test('returns correct relative time for minutes', () => {
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(getRelativeTime(fiveMinutesAgo, now)).toBe('5 minutes ago');
    const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);
    expect(getRelativeTime(inFiveMinutes, now)).toBe('in 5 minutes');
  });

  test('returns correct relative time for hours', () => {
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(getRelativeTime(twoHoursAgo, now)).toBe('2 hours ago');
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    expect(getRelativeTime(inTwoHours, now)).toBe('in 2 hours');
  });

  test('returns correct relative time for days', () => {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(threeDaysAgo, now)).toBe('3 days ago');
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(inThreeDays, now)).toBe('in 3 days');
  });

  test('handles different locales', () => {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(getRelativeTime(oneDayAgo, now, { locale: 'en-US' })).toBe(
      '1 day ago',
    );
    expect(getRelativeTime(oneDayAgo, now, { locale: 'fr-FR' })).toBe(
      'il y a 1 jour',
    );
  });

  test('throws an error for invalid date inputs', () => {
    expect(() => getRelativeTime('invalid-date', now)).toThrow(
      'Date format not recognized',
    );
  });
});
