declare const _default$2: (phoneNumber: string | number, countryCode?: string | number | undefined) => boolean;

declare const _default$1: (phoneNumber: string | number, countryCode?: string | number | undefined) => string;

interface PhoneInfo {
    countryCode: string;
    dialCode: string;
    formattedPhoneNumber: string;
    formatTemplate: string;
    phoneNumber: string;
}
declare const _default: (phoneNumber: string, country?: string | undefined) => PhoneInfo;

export { _default$1 as formatPhoneNumber, _default$2 as isValidPhoneNumber, _default as parsePhoneNumber };
