import getPaymentTranslationsList from '../getPaymentTranslationsList';
import { getPaymentTranslationsInfo } from '../utils';
import type { PaymentTranslationsCodeType } from '../types';

describe('getPaymentTranslationsList', () => {
  it('returns all 7 Indian language entries', () => {
    const list = getPaymentTranslationsList();
    expect(typeof list).toBe('object');
    expect(Object.keys(list).length).toBe(7);
  });

  it('each entry has a non-empty pay_now string', () => {
    const list = getPaymentTranslationsList();
    for (const code of Object.keys(list)) {
      const entry = list[code as PaymentTranslationsCodeType];
      expect(typeof entry.pay_now).toBe('string');
      expect(entry.pay_now.length).toBeGreaterThan(0);
    }
  });

  it('contains all expected language codes', () => {
    const list = getPaymentTranslationsList();
    (['hi', 'bn', 'mr', 'gu', 'ta', 'te', 'kn'] as const).forEach((code) => {
      expect(list).toHaveProperty(code);
    });
  });

  it('Hindi entry has correct language_name', () => {
    const list = getPaymentTranslationsList();
    expect(list.hi.language_name).toBe('Hindi');
    expect(list.hi.pay_now).toBeTruthy();
  });
});

describe('getPaymentTranslationsInfo', () => {
  it('returns strings for a valid code', () => {
    const info = getPaymentTranslationsInfo('hi');
    expect(info).not.toBeNull();
    expect(info?.language_name).toBe('Hindi');
    expect(info?.pay_now).toBeTruthy();
  });

  it('returns data for all 7 supported codes', () => {
    const codes: PaymentTranslationsCodeType[] = ['hi', 'bn', 'mr', 'gu', 'ta', 'te', 'kn'];
    for (const code of codes) {
      const info = getPaymentTranslationsInfo(code);
      expect(info).not.toBeNull();
      expect(info?.pay_now).toBeTruthy();
    }
  });

  it('returns null for an unknown code', () => {
    const info = getPaymentTranslationsInfo('xx' as PaymentTranslationsCodeType);
    expect(info).toBeNull();
  });
});
