import { isValidName } from '../index';

describe('isValidName', () => {
  it('returns valid for a normal name', () => {
    expect(isValidName('Mary Jane')).toEqual({ isValid: true });
  });

  it('rejects blocklisted names', () => {
    expect(isValidName('test')).toEqual({
      isValid: false,
      reason: 'blocklisted',
    });
  });

  it('rejects sequential characters', () => {
    expect(isValidName('bcdef')).toEqual({
      isValid: false,
      reason: 'sequential_chars',
    });
  });

  it('rejects repeating characters', () => {
    expect(isValidName('soooon')).toEqual({
      isValid: false,
      reason: 'repeating_chars',
    });
  });

  it('rejects names that are not alpha dominant', () => {
    expect(isValidName('1 2 3 4')).toEqual({
      isValid: false,
      reason: 'non_alpha_dominant',
    });
  });

  it('supports extending the default blocklist', () => {
    expect(
      isValidName('captain', {
        blocklist: ['captain'],
        allowBlocklistExtension: true,
      }),
    ).toEqual({
      isValid: false,
      reason: 'blocklisted',
    });
  });
});
