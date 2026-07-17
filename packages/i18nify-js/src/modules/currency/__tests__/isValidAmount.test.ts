import isValidAmount from '../isValidAmount';

describe('isValidAmount', () => {
  describe('USD (minor_unit=2)', () => {
    it.each([
      ['10', true],
      ['10.', false],
      ['10.5', true],
      ['10.50', true],
      ['0.99', true],
      ['1000.00', true],
      ['-10.50', true],
    ])('isValidAmount("%s", "USD") → %s', (amount, expected) => {
      expect(isValidAmount(amount, 'USD')).toBe(expected);
    });

    it('rejects more than 2 decimal places', () => {
      expect(isValidAmount('10.123', 'USD')).toBe(false);
      expect(isValidAmount('0.001', 'USD')).toBe(false);
    });
  });

  describe('JPY (minor_unit=0 — no decimals allowed)', () => {
    it.each([
      ['100', true],
      ['0', true],
      ['-500', true],
    ])('isValidAmount("%s", "JPY") → true', (amount) => {
      expect(isValidAmount(amount, 'JPY')).toBe(true);
    });

    it.each([['100.5'], ['100.00'], ['1.1']])(
      'isValidAmount("%s", "JPY") → false',
      (amount) => {
        expect(isValidAmount(amount, 'JPY')).toBe(false);
      },
    );
  });

  describe('KWD (minor_unit=3)', () => {
    it.each([
      ['10.123', true],
      ['10.12', true],
      ['10.1', true],
      ['10', true],
    ])('isValidAmount("%s", "KWD") → true', (amount) => {
      expect(isValidAmount(amount, 'KWD')).toBe(true);
    });

    it('rejects 4+ decimal places', () => {
      expect(isValidAmount('10.1234', 'KWD')).toBe(false);
    });
  });

  describe('CLF (minor_unit=4)', () => {
    it('allows up to 4 decimal places', () => {
      expect(isValidAmount('1.1234', 'CLF')).toBe(true);
    });

    it('rejects 5 decimal places', () => {
      expect(isValidAmount('1.12345', 'CLF')).toBe(false);
    });
  });

  describe('invalid currency code', () => {
    it('returns false for unknown currency', () => {
      expect(isValidAmount('10.50', 'XYZ')).toBe(false);
    });

    it('returns false for empty currency code', () => {
      expect(isValidAmount('10.50', '')).toBe(false);
    });

    it('returns false for lowercase currency code', () => {
      expect(isValidAmount('10.50', 'usd')).toBe(false);
    });
  });

  describe('invalid amount format', () => {
    it.each([
      ['abc', 'USD'],
      ['10,50', 'USD'],
      ['1e2', 'USD'],
      ['', 'USD'],
      ['   ', 'USD'],
      ['1.2.3', 'USD'],
      ['$10.50', 'USD'],
      ['1 000.50', 'USD'],
    ])('isValidAmount("%s", %s) → false', (amount, currency) => {
      expect(isValidAmount(amount, currency)).toBe(false);
    });
  });

  describe('non-string inputs', () => {
    it.each([undefined, null, 123, {}, []])(
      'amount=%p returns false',
      (amount) => {
        expect(isValidAmount(amount as any, 'USD')).toBe(false);
      },
    );

    it.each([undefined, null, 123, {}, []])(
      'currencyCode=%p returns false',
      (currency) => {
        expect(isValidAmount('10.50', currency as any)).toBe(false);
      },
    );
  });

  describe('edge cases', () => {
    it('trims leading/trailing whitespace from amount', () => {
      expect(isValidAmount('  10.50  ', 'USD')).toBe(true);
    });

    it('zero with 2 decimals is valid for USD', () => {
      expect(isValidAmount('0.00', 'USD')).toBe(true);
    });

    it('integer amount is valid for any currency', () => {
      expect(isValidAmount('100', 'JPY')).toBe(true);
      expect(isValidAmount('100', 'USD')).toBe(true);
      expect(isValidAmount('100', 'KWD')).toBe(true);
    });
  });
});
