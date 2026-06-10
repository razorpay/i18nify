import getPaymentTranslationsList from '../getPaymentTranslationsList';
import type { PaymentTranslationsCodeType } from '../types';

describe('getPaymentTranslationsList', () => {
  it('returns all payment translation entries', () => {
    const list = getPaymentTranslationsList();
    expect(typeof list).toBe('object');
    expect(Object.keys(list).length).toBeGreaterThan(0);
  });

  it('returns 7 Indian language entries', () => {
    const list = getPaymentTranslationsList();
    expect(Object.keys(list).length).toBe(7);
  });

  it('contains all expected language codes', () => {
    const list = getPaymentTranslationsList();
    const codes = Object.keys(list);
    expect(codes).toContain('hi');
    expect(codes).toContain('bn');
    expect(codes).toContain('mr');
    expect(codes).toContain('gu');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('kn');
  });

  it('each entry has expected shape', () => {
    const list = getPaymentTranslationsList();
    const sample = Object.values(list)[0] as Record<string, unknown>;
    expect(typeof sample).toBe('object');
    expect(sample).toHaveProperty('language_name');
    expect(sample).toHaveProperty('native_name');
    expect(sample).toHaveProperty('strings');
  });

  it('each entry strings has required payment UI keys', () => {
    const list = getPaymentTranslationsList();
    const requiredKeys = [
      'pay_now', 'cancel', 'amount', 'card_number', 'cvv',
      'expiry_date', 'payment_successful', 'payment_failed',
      'upi_id', 'bank', 'otp',
    ];
    for (const [, entry] of Object.entries(list)) {
      const e = entry as { strings: Record<string, string> };
      for (const key of requiredKeys) {
        expect(e.strings[key]).toBeTruthy();
      }
    }
  });

  it('returns entry for a valid language code', () => {
    const list = getPaymentTranslationsList();
    const code = 'hi' as PaymentTranslationsCodeType;
    expect(list[code]).toBeTruthy();
    expect((list[code] as { language_name: string }).language_name).toBe('Hindi');
  });

  it('Hindi pay_now string is correct', () => {
    const list = getPaymentTranslationsList();
    const hi = list['hi' as PaymentTranslationsCodeType] as {
      strings: { pay_now: string };
    };
    expect(hi.strings.pay_now).toBe('अभी भुगतान करें');
  });
});
