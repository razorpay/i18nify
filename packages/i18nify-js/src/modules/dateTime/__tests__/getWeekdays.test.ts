import { getWeekdays } from '../index';

describe('dateTime - getWeekdays', () => {
  const testCases = [
    {
      locale: 'en-US',
      expected: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      weekday: undefined,
    },
    {
      locale: 'de-DE',
      expected: [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag',
      ],
      weekday: undefined,
    },
    {
      locale: 'fr-FR',
      expected: [
        'dimanche',
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi',
      ],
      weekday: undefined,
    },
    {
      locale: 'en-US',
      expected: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekday: 'short',
    },
  ];

  testCases.forEach(({ locale, expected, weekday }) => {
    test(`returns correct weekdays for ${locale} locale`, () => {
      const weekdays = getWeekdays({
        locale,
        weekday: weekday as any,
      });
      expect(weekdays).toHaveLength(7);
      expect(weekdays).toEqual(expected);
    });
  });

  test('throws a generic error message for invalid intl options', () => {
    expect(() =>
      getWeekdays({
        locale: 'en-US',
        weekday: 'dummy' as any,
      }),
    ).toThrow(
      'Error: An error occurred while creating the DateFormatter instance or formatting the weekdays: Value dummy out of range for Intl.DateTimeFormat options property weekday. Please ensure the provided options are valid and try again.',
    );
  });

  test('uses default locale when no locale is provided', () => {
    const weekdays = getWeekdays({});
    expect(weekdays).toHaveLength(7);
    expect(weekdays[0]).toBe('Sunday'); // Default locale is 'en-US'
  });

  test('handles non-Error instance in catch block', () => {
    jest.isolateModules(() => {
      jest.doMock('@internationalized/date', () => ({
        DateFormatter: jest.fn().mockImplementation(() => {
          throw 'Non-Error string';
        }),
      }));

      const { getWeekdays } = require('../index');

      expect(() => getWeekdays({})).toThrow(
        'Error: An unknown error occurred. Error details: Non-Error string',
      );
    });
  });

  describe('narrow weekday style', () => {
    test('returns single-letter narrow weekdays for en-US', () => {
      const weekdays = getWeekdays({ locale: 'en-US', weekday: 'narrow' });
      expect(weekdays).toHaveLength(7);
      expect(weekdays).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    });

    test('returns narrow weekdays for fr-FR locale', () => {
      const weekdays = getWeekdays({ locale: 'fr-FR', weekday: 'narrow' });
      expect(weekdays).toHaveLength(7);
    });
  });

  describe('week always starts from Sunday', () => {
    test('first element is Sunday for en-US long format', () => {
      const weekdays = getWeekdays({ locale: 'en-US' });
      expect(weekdays[0]).toBe('Sunday');
      expect(weekdays[6]).toBe('Saturday');
    });

    test('first element is Sunday for en-US short format', () => {
      const weekdays = getWeekdays({ locale: 'en-US', weekday: 'short' });
      expect(weekdays[0]).toBe('Sun');
      expect(weekdays[6]).toBe('Sat');
    });

    test('first element is Sunday equivalent for de-DE', () => {
      const weekdays = getWeekdays({ locale: 'de-DE' });
      expect(weekdays[0]).toBe('Sonntag');
      expect(weekdays[6]).toBe('Samstag');
    });
  });

  describe('always returns exactly 7 days', () => {
    test.each(['long', 'short', 'narrow'] as const)(
      'returns 7 weekdays for %s format',
      (weekday) => {
        expect(getWeekdays({ locale: 'en-US', weekday })).toHaveLength(7);
      },
    );
  });
});
