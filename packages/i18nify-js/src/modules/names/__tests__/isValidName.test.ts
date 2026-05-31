import isValidName from '../isValidName';

describe('isValidName', () => {
  // --- Valid names ---
  it('accepts a simple ASCII name', () => {
    expect(isValidName('John')).toBe(true);
  });

  it('accepts a full name with space', () => {
    expect(isValidName('John Smith')).toBe(true);
  });

  it('accepts a hyphenated surname', () => {
    expect(isValidName('Mary-Jane Watson')).toBe(true);
  });

  it("accepts an apostrophe surname (O'Brien)", () => {
    expect(isValidName("O'Brien")).toBe(true);
  });

  it('accepts a name with a period (Dr. Smith)', () => {
    expect(isValidName('Dr. Smith')).toBe(true);
  });

  it('accepts a 2-character name (minimum)', () => {
    expect(isValidName('Jo')).toBe(true);
  });

  it('accepts a 100-character name (maximum)', () => {
    expect(isValidName('A'.repeat(100))).toBe(true);
  });

  it('accepts names with leading/trailing spaces (trimmed)', () => {
    expect(isValidName('  Alice  ')).toBe(true);
  });

  it('accepts Unicode letters – Hindi', () => {
    expect(isValidName('रामलाल')).toBe(true);
  });

  it('accepts Unicode letters – Arabic', () => {
    expect(isValidName('محمد')).toBe(true);
  });

  it('accepts Unicode letters – Chinese', () => {
    expect(isValidName('李明')).toBe(true);
  });

  it('accepts Unicode letters – Japanese', () => {
    expect(isValidName('田中')).toBe(true);
  });

  // --- Invalid names ---
  it('rejects an empty string', () => {
    expect(isValidName('')).toBe(false);
  });

  it('rejects a single character', () => {
    expect(isValidName('A')).toBe(false);
  });

  it('rejects a string of only spaces', () => {
    expect(isValidName('   ')).toBe(false);
  });

  it('rejects a name with digits', () => {
    expect(isValidName('John2')).toBe(false);
  });

  it('rejects a string of only digits', () => {
    expect(isValidName('12345')).toBe(false);
  });

  it('rejects a name with @ character', () => {
    expect(isValidName('John@Doe')).toBe(false);
  });

  it('rejects a name with # character', () => {
    expect(isValidName('John#')).toBe(false);
  });

  it('rejects a name exceeding 100 characters', () => {
    expect(isValidName('A'.repeat(101))).toBe(false);
  });

  it('rejects a name with a tab character', () => {
    expect(isValidName('John\tDoe')).toBe(false);
  });

  it('rejects a name with a newline character', () => {
    expect(isValidName('John\nDoe')).toBe(false);
  });

  it('rejects a name with underscore', () => {
    expect(isValidName('John_Doe')).toBe(false);
  });

  it('rejects a name with an exclamation mark', () => {
    expect(isValidName('Alice!')).toBe(false);
  });
});
