import getWeekdays from '../getWeekdays';
import { DateTimeFormatOptions } from '../types';

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
      options: {},
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
      options: {},
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
      options: {},
    },
    {
      locale: 'en-US',
      expected: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      options: { weekday: 'short' },
    },
  ];

  testCases.forEach(({ locale, expected, options }) => {
    test(`returns correct weekdays for ${locale} locale`, () => {
      const weekdays = getWeekdays({
        locale,
        intlOptions :options as DateTimeFormatOptions,
      }
      );
      expect(weekdays).toHaveLength(7);
      expect(weekdays).toEqual(expected);
    });
  });
});
