import { matchesEntirely } from '../utils';

describe('matchesEntirely', () => {
  test('should return true for exact match', () => {
    const text = '12345';
    const regex = '\\d{5}';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should return false for partial match', () => {
    const text = '12345 more text';
    const regex = '\\d{5}';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should return false for no match', () => {
    const text = 'abcde';
    const regex = '\\d{5}';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should handle empty text input', () => {
    const text = '';
    const regex = '\\d{5}';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should handle empty regex input', () => {
    const text = '12345';
    const regex = '';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should handle both empty text and regex input', () => {
    const text = '';
    const regex = '';
    expect(matchesEntirely(text, regex)).toBe(true); // Because an empty string exactly matches an empty pattern
  });

  test('should return true when special characters are involved and matched exactly', () => {
    const text = 'abc?*123';
    const regex = 'abc\\?\\*123';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should return false for regex that does not cover the entire string', () => {
    const text = 'hello 123 world';
    const regex = '\\d{3}';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should return true for complex pattern matching entire string', () => {
    const text = 'Hello, how are you?';
    const regex = '[A-Za-z,\\s?]+';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should return false when regex pattern is incorrect', () => {
    const text = '12345';
    const regex = '[A-Z'; // Missing closing bracket
    expect(() => matchesEntirely(text, regex)).toThrow(SyntaxError);
  });

  test('should test for case sensitivity', () => {
    const text = 'CaseSensitive';
    const regex = 'casesensitive';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should return true for matching numbers as strings', () => {
    const text = '0123456789';
    const regex = '\\d+';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should handle unicode characters', () => {
    const text = 'こんにちは';
    const regex = 'こんにちは';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should handle complex unicode patterns', () => {
    const text = 'こんにちは123';
    const regex = '\\w+\\d+';
    expect(matchesEntirely(text, regex)).toBe(false); // `\w` does not match Japanese characters by default
  });

  test('should handle newline characters in text', () => {
    const text = `line1
line2`;
    const regex = 'line1\\nline2';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should fail when text contains newline but regex does not account for it', () => {
    const text = `line1
line2`;
    const regex = 'line1line2';
    expect(matchesEntirely(text, regex)).toBe(false);
  });

  test('should correctly handle text with leading and trailing whitespaces', () => {
    const text = '  trimmed  ';
    const regex = '\\s*trimmed\\s*';
    expect(matchesEntirely(text, regex)).toBe(true);
  });

  test('should return false if the regex requires more characters than are in text', () => {
    const text = 'short';
    const regex = 'shorter';
    expect(matchesEntirely(text, regex)).toBe(false);
  });
});
