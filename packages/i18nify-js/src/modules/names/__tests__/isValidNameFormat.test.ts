import isValidNameFormat from '../isValidNameFormat';

describe('isValidNameFormat', () => {
  // --- Valid names ---
  it('accepts a simple ASCII name', () => {
    expect(isValidNameFormat('John')).toBe(true);
  });

  it('accepts a full name with space', () => {
    expect(isValidNameFormat('John Smith')).toBe(true);
  });

  it('accepts a hyphenated surname', () => {
    expect(isValidNameFormat('Mary-Jane Watson')).toBe(true);
  });

  it("accepts an apostrophe surname (O'Brien)", () => {
    expect(isValidNameFormat("O'Brien")).toBe(true);
  });

  it('accepts a name with a period (Dr. Smith)', () => {
    expect(isValidNameFormat('Dr. Smith')).toBe(true);
  });

  it('accepts a 2-character name (minimum)', () => {
    expect(isValidNameFormat('Jo')).toBe(true);
  });

  it('accepts a 100-character name (maximum)', () => {
    expect(isValidNameFormat('A'.repeat(100))).toBe(true);
  });

  it('accepts names with leading/trailing spaces (trimmed)', () => {
    expect(isValidNameFormat('  Alice  ')).toBe(true);
  });

  it('accepts Unicode letters – Hindi', () => {
    expect(isValidNameFormat('रामलाल')).toBe(true);
  });

  it('accepts Unicode letters – Arabic', () => {
    expect(isValidNameFormat('محمد')).toBe(true);
  });

  it('accepts Unicode letters – Chinese', () => {
    expect(isValidNameFormat('李明')).toBe(true);
  });

  it('accepts Unicode letters – Japanese', () => {
    expect(isValidNameFormat('田中')).toBe(true);
  });

  // --- Invalid names ---
  it('rejects an empty string', () => {
    expect(isValidNameFormat('')).toBe(false);
  });

  it('rejects a single character', () => {
    expect(isValidNameFormat('A')).toBe(false);
  });

  it('rejects a string of only spaces', () => {
    expect(isValidNameFormat('   ')).toBe(false);
  });

  it('rejects a name with digits', () => {
    expect(isValidNameFormat('John2')).toBe(false);
  });

  it('rejects a string of only digits', () => {
    expect(isValidNameFormat('12345')).toBe(false);
  });

  it('rejects a name with @ character', () => {
    expect(isValidNameFormat('John@Doe')).toBe(false);
  });

  it('rejects a name with # character', () => {
    expect(isValidNameFormat('John#')).toBe(false);
  });

  it('rejects a name exceeding 100 characters', () => {
    expect(isValidNameFormat('A'.repeat(101))).toBe(false);
  });

  it('rejects a name with a tab character', () => {
    expect(isValidNameFormat('John\tDoe')).toBe(false);
  });

  it('rejects a name with a newline character', () => {
    expect(isValidNameFormat('John\nDoe')).toBe(false);
  });

  it('rejects a name with underscore', () => {
    expect(isValidNameFormat('John_Doe')).toBe(false);
  });

  it('rejects a name with an exclamation mark', () => {
    expect(isValidNameFormat('Alice!')).toBe(false);
  });
});
