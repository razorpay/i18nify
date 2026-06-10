import getPaymentTranslationsList from '../getPaymentTranslationsList';
import type { PaymentTranslationsCodeType } from '../types';
import { getPaymentTranslationsInfo } from '../utils';

describe('getPaymentTranslationsList', () => {
  it('returns all 7 Indian language entries', () => {
    const list = getPaymentTranslationsList();
    expect(typeof list).toBe('object');
    expect(Object.keys(list).length).toBe(7);
  });

  it('each entry has pay_now string', () => {
    const list = getPaymentTranslationsList();
    for (const code of Object.keys(list)) {
      const entry = list[code as PaymentTranslationsCodeType];
      expect(typeof entry.pay_now).toBe('string');
      expect(entry.pay_now.length).toBeGreaterThan(0);
    }
  });

  it('contains expected language codes', () => {
    const list = getPaymentTranslationsList();
    expect(list).toHaveProperty('hi');
    expect(list).toHaveProperty('bn');
    expect(list).toHaveProperty('mr');
    expect(list).toHaveProperty('gu');
    expect(list).toHaveProperty('ta');
    expect(list).toHaveProperty('te');
    expect(list).toHaveProperty('kn');
  });

  it('Hindi pay_now is non-empty', () => {
    const list = getPaymentTranslationsList();
    expect(list.hi.pay_now).toBeTruthy();
    expect(list.hi.language_name).toBe('Hindi');
  });
});

describe('getPaymentTranslationsInfo', () => {
  it('returns strings for a valid code', () => {
    const info = getPaymentTranslationsInfo('hi');
    expect(info).not.toBeNull();
    expect(info?.language_name).toBe('Hindi');
    expect(info?.pay_now.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown code', () => {
    const info = getPaymentTranslationsInfo(
      'xx' as PaymentTranslationsCodeType,
    );
    expect(info).toBeNull();
  });
});
