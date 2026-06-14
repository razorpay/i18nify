import getPaymentTranslationsList from '../getPaymentTranslationsList';
import { getPaymentTranslationsInfo } from '../utils';
import { PAYMENT_TRANSLATIONS_CODE_LIST } from '../constants';
import type { PaymentTranslationsStrings } from '../types';

const EXPECTED_KEYS: (keyof PaymentTranslationsStrings)[] = [
  'language_name',
  'script',
  'pay_now',
  'amount',
  'cancel',
  'confirm',
  'payment_successful',
  'payment_failed',
  'processing',
  'total',
  'retry',
  'enter_amount',
  'card_number',
  'card_expiry',
  'cvv',
  'name_on_card',
  'upi_id',
  'net_banking',
  'wallet',
  'transaction_id',
  'back',
  'error_try_again',
  'order_id',
  'receipt',
];

describe('getPaymentTranslationsList', () => {
  describe('return shape', () => {
    it('returns an object', () => {
      const result = getPaymentTranslationsList();
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    it('contains exactly the 7 Indian language codes', () => {
      const result = getPaymentTranslationsList();
      const keys = Object.keys(result).sort();
      expect(keys).toEqual([...PAYMENT_TRANSLATIONS_CODE_LIST].sort());
    });

    it('every entry has all 24 required string fields', () => {
      const result = getPaymentTranslationsList();
      for (const code of PAYMENT_TRANSLATIONS_CODE_LIST) {
        const entry = result[code];
        for (const key of EXPECTED_KEYS) {
          expect(entry).toHaveProperty(key);
          expect(typeof entry[key]).toBe('string');
        }
      }
    });

    it('no entry has empty strings for core fields', () => {
      const result = getPaymentTranslationsList();
      const coreFields: (keyof PaymentTranslationsStrings)[] = [
        'language_name',
        'script',
        'pay_now',
        'amount',
        'cancel',
        'confirm',
      ];
      for (const code of PAYMENT_TRANSLATIONS_CODE_LIST) {
        for (const field of coreFields) {
          expect(result[code][field]).not.toBe('');
        }
      }
    });
  });

  describe('Hindi (hi)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['hi'].language_name).toBe('Hindi');
      expect(result['hi'].script).toBe('Devanagari');
    });

    it('pay_now is non-empty', () => {
      expect(getPaymentTranslationsList()['hi'].pay_now).toBeTruthy();
    });
  });

  describe('Bengali (bn)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['bn'].language_name).toBe('Bengali');
      expect(result['bn'].script).toBe('Bengali');
    });
  });

  describe('Tamil (ta)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['ta'].language_name).toBe('Tamil');
      expect(result['ta'].script).toBe('Tamil');
    });
  });

  describe('Telugu (te)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['te'].language_name).toBe('Telugu');
      expect(result['te'].script).toBe('Telugu');
    });
  });

  describe('Kannada (kn)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['kn'].language_name).toBe('Kannada');
      expect(result['kn'].script).toBe('Kannada');
    });
  });

  describe('Gujarati (gu)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['gu'].language_name).toBe('Gujarati');
      expect(result['gu'].script).toBe('Gujarati');
    });
  });

  describe('Marathi (mr)', () => {
    it('has correct language_name and script', () => {
      const result = getPaymentTranslationsList();
      expect(result['mr'].language_name).toBe('Marathi');
      expect(result['mr'].script).toBe('Devanagari');
    });
  });

  describe('all languages produce distinct pay_now strings', () => {
    it('each language has a unique pay_now translation', () => {
      const result = getPaymentTranslationsList();
      const payNowValues = PAYMENT_TRANSLATIONS_CODE_LIST.map(
        (code) => result[code].pay_now,
      );
      const unique = new Set(payNowValues);
      expect(unique.size).toBe(PAYMENT_TRANSLATIONS_CODE_LIST.length);
    });
  });
});

describe('getPaymentTranslationsInfo (utils)', () => {
  it('returns strings for a valid code', () => {
    const result = getPaymentTranslationsInfo('hi');
    expect(result).not.toBeNull();
    expect(result?.language_name).toBe('Hindi');
  });

  it('returns null for an unknown code', () => {
    const result = getPaymentTranslationsInfo('xx' as never);
    expect(result).toBeNull();
  });

  it('returns all expected keys for Tamil', () => {
    const result = getPaymentTranslationsInfo('ta');
    expect(result).not.toBeNull();
    for (const key of EXPECTED_KEYS) {
      expect(result).toHaveProperty(key);
    }
  });
});
