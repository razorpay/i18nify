import { replaceLastXsWithChars } from '../utils';

describe('phone number - utils - replaceLastXsWithChars', () => {
  test("replaces the last N x's with characters from the replacement string", () => {
    expect(replaceLastXsWithChars('xxxxxx', 'abc', 3)).toBe('xxxabc');
  });

  test.each([
    ['no xs present', 'hello', 'a', 2, 'hello'],
    ['replacement string shorter than count of xs', 'xxxxx', 'ab', 5, 'xxxab'],
    ['replacement string longer than needed', 'xxxx', 'abcdef', 2, 'xxef'],
    ['empty source string', '', 'abc', 3, ''],
    ['empty replacement string', 'xxxx', '', 3, 'xxxx'],
    ['count n is zero', 'xxxx', 'abc', 0, 'xxxx'],
  ])('%s', (_, source, replacement, n, expected) => {
    expect(replaceLastXsWithChars(source, replacement, n)).toBe(expected);
  });

  test("replaces nothing when n is greater than the number of x's", () => {
    expect(replaceLastXsWithChars('xx', 'abc', 5)).toBe('bc');
  });

  test('handles strings with mixed characters', () => {
    expect(replaceLastXsWithChars('ax1x2x3x', 'xyz', 3)).toBe('ax1x2y3z');
  });

  test('negative n is treated as zero', () => {
    expect(replaceLastXsWithChars('xxxx', 'abc', -1)).toBe('xxxx');
  });

  test('n larger than both strings only replaces up to the last available xs', () => {
    expect(replaceLastXsWithChars('xxyyxx', 'abc', 10)).toBe('xayybc');
  });
});
