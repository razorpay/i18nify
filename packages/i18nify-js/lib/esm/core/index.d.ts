interface I18nState {
    locale: string;
    direction: 'ltr' | 'rtl' | string;
    country: string;
}

declare const _default$2: () => I18nState;

declare const _default$1: (newState: Partial<I18nState>) => void;

declare const _default: () => void;

export { _default$2 as getState, _default as resetState, _default$1 as setState };
