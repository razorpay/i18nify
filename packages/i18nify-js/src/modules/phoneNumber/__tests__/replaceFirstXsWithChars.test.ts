import { replaceFirstXsWithChars } from '../utils';

describe('phone number - utils - replaceFirstXsWithChars', () => {
  test("replaces the first N x's with characters from the replacement string", () => {
    expect(replaceFirstXsWithChars('xxxxxx', 'abc', 3)).toBe('abcxxx');
  });

  test.each([
    ['no xs present', 'hello', 'a', 2, 'hello'],
    ['replacement string shorter than count of xs', 'xxxxx', 'ab', 5, 'abxxx'],
    [
      'replacement string longer than needed',
      'xxxx',
      'abcdef',
      2,
      'abxx'.slice(0, 4),
    ],
    ['empty source string', '', 'abc', 3, ''],
    ['empty replacement string', 'xxxx', '', 3, 'xxxx'],
    ['count n is zero', 'xxxx', 'abc', 0, 'xxxx'],
  ])('%s', (_, source, replacement, n, expected) => {
    expect(replaceFirstXsWithChars(source, replacement, n)).toBe(expected);
  });

  test("replaces nothing when n is greater than the number of x's", () => {
    expect(replaceFirstXsWithChars('xx', 'abc', 5)).toBe('abcx'.slice(0, 2));
  });

  test('handles strings with mixed characters', () => {
    expect(replaceFirstXsWithChars('ax1x2x3x', 'xyz', 3)).toBe('ax1y2z3x');
  });

  test('negative n is treated as zero', () => {
    expect(replaceFirstXsWithChars('xxxx', 'abc', -1)).toBe('xxxx');
  });

  test('n larger than both strings only replaces up to the shortest', () => {
    expect(replaceFirstXsWithChars('xxyyxx', 'abc', 10)).toBe('abyycx');
  });
});
