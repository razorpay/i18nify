import { s as state } from './index-fuw8iepm.js';

const getLocale = (options = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. options.locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    let locale = (options === null || options === void 0 ? void 0 : options.locale) || state.getState().locale;
    // If a specific locale is provided, use it; otherwise, use the browser's locale
    if (locale) {
        return locale;
    }
    // Check if running in a non-browser environment (e.g., Node.js or older browsers).
    if (typeof navigator === 'undefined') {
        return 'en-IN';
    }
    // Check if the browser supports the Intl object and user language preferences.
    if (window.Intl &&
        typeof window.Intl === 'object' &&
        (window.navigator.languages || window.navigator.language)) {
        const userLocales = window.navigator.languages || [
            window.navigator.language,
        ];
        return userLocales[0];
    }
    // Fallback to a supported locale or the default locale.
    return 'en-IN';
};

export { getLocale as g };
//# sourceMappingURL=getLocale-ais0bWmO.js.map
