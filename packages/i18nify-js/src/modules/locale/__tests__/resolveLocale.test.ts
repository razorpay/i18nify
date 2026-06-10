import resolveLocale from '../resolveLocale';

// Helpers to control localStorage mock
const storage: Record<string, string> = {};
const storageMock = {
  getItem: jest.fn((key: string) => storage[key] ?? null),
  setItem: jest.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete storage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  }),
};

const setNavigator = (language: string, languages: string[] = [language]) => {
  Object.defineProperty(window, 'navigator', {
    value: { language, languages },
    writable: true,
    configurable: true,
  });
};

beforeEach(() => {
  storageMock.clear();
  jest.clearAllMocks();
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    writable: true,
    configurable: true,
  });
  // Blank out browser locale so tests start in a clean state
  setNavigator('', []);
});

describe('resolveLocale', () => {
  describe('Priority 1 — localStorage', () => {
    it('returns stored locale when key is present', () => {
      storageMock.setItem('i18nify-locale', 'fr-FR');
      expect(resolveLocale()).toBe('fr-FR');
    });

    it('accepts a custom storageKey', () => {
      storageMock.setItem('my-locale', 'de-DE');
      expect(resolveLocale({ storageKey: 'my-locale' })).toBe('de-DE');
    });

    it('trims whitespace from the stored value', () => {
      storageMock.setItem('i18nify-locale', '  ja  ');
      expect(resolveLocale()).toBe('ja');
    });

    it('falls through when stored value is whitespace-only', () => {
      storageMock.setItem('i18nify-locale', '   ');
      expect(resolveLocale({ locale: 'es-ES' })).toBe('es-ES');
    });

    it('storage beats explicit locale option', () => {
      storageMock.setItem('i18nify-locale', 'fr-FR');
      expect(resolveLocale({ locale: 'es-ES' })).toBe('fr-FR');
    });

    it('storage beats browser locale', () => {
      storageMock.setItem('i18nify-locale', 'fr-FR');
      setNavigator('pt-BR', ['pt-BR']);
      expect(resolveLocale()).toBe('fr-FR');
    });
  });

  describe('Priority 2 — explicit locale option', () => {
    it('returns explicit locale when no storage value', () => {
      expect(resolveLocale({ locale: 'es-ES' })).toBe('es-ES');
    });

    it('trims whitespace from the explicit locale', () => {
      expect(resolveLocale({ locale: '  ko  ' })).toBe('ko');
    });

    it('explicit locale beats browser locale', () => {
      setNavigator('pt-BR', ['pt-BR']);
      expect(resolveLocale({ locale: 'es-ES' })).toBe('es-ES');
    });

    it('falls through when explicit locale is whitespace-only', () => {
      setNavigator('pt-BR', ['pt-BR']);
      expect(resolveLocale({ locale: '   ' })).toBe('pt-BR');
    });
  });

  describe('Priority 3 — browser (navigator)', () => {
    it('returns navigator.language when no storage or options', () => {
      setNavigator('pt-BR', []);
      expect(resolveLocale()).toBe('pt-BR');
    });

    it('prefers navigator.languages[0] over navigator.language', () => {
      setNavigator('en', ['zh-CN', 'en']);
      expect(resolveLocale()).toBe('zh-CN');
    });

    it('falls back to navigator.language when languages[] is empty', () => {
      setNavigator('en-GB', []);
      expect(resolveLocale()).toBe('en-GB');
    });

    it('browser locale beats fallback', () => {
      setNavigator('ar', ['ar']);
      expect(resolveLocale({ fallbackLocale: 'en-US' })).toBe('ar');
    });
  });

  describe('Priority 4 — fallback', () => {
    it('returns "en" by default when all signals are absent', () => {
      expect(resolveLocale()).toBe('en');
    });

    it('returns custom fallbackLocale', () => {
      expect(resolveLocale({ fallbackLocale: 'en-US' })).toBe('en-US');
    });

    it('falls back to "en" when fallbackLocale is an empty string', () => {
      expect(resolveLocale({ fallbackLocale: '' })).toBe('en');
    });

    it('falls back to "en" when fallbackLocale is whitespace-only', () => {
      expect(resolveLocale({ fallbackLocale: '   ' })).toBe('en');
    });
  });

  describe('default options', () => {
    it('works with no arguments (empty options)', () => {
      expect(typeof resolveLocale()).toBe('string');
    });

    it('works with an empty options object', () => {
      expect(typeof resolveLocale({})).toBe('string');
    });
  });
});
