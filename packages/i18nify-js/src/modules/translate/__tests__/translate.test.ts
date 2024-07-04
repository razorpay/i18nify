import { translate } from '../index';

describe('translate function', () => {
  test('should return the translated text for a valid locale (Arabic)', async () => {
    const result = await translate('Your profile', 'ar');
    expect(result).toBe('ملفك الشخصي');
  });

  test('should return the translated text for a valid locale (Hindi)', async () => {
    const result = await translate('Your profile', 'hi');
    expect(result).toBe('आपकी प्रोफ़ाइल');
  });

  test('should return the original text if translation is not found for the given locale', async () => {
    const result = await translate('Unknown text', 'ar');
    expect(result).toBe('Unknown text');
  });

  test('should return the original text if the locale file is not found', async () => {
    const result = await translate('Your profile', 'es'); // Assuming Spanish is not available
    expect(result).toBe('Tu perfil');
  });

  test('should return the original text if text is not found in the translations', async () => {
    const result = await translate('Goodbye, World!', 'hi');
    expect(result).toBe('Goodbye, World!');
  });
});
