declare const _default$2: (phoneNumber: string | number, countryCode?: string | number) => boolean;

declare const _default$1: (phoneNumber: string | number, countryCode?: string | number) => string;

interface PhoneInfo {
    countryCode: string;
    dialCode: string;
    formattedPhoneNumber: string;
    formatTemplate: string;
}
declare const _default: (phoneNumber: string) => PhoneInfo;

export { _default$1 as formatPhoneNumber, _default as parsePhoneNumber, _default$2 as validatePhoneNumber };
