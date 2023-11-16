declare const COUNTRY_PHONE_REGEX: {
    IN: RegExp;
};
declare function export_default(phone: string, country: keyof typeof COUNTRY_PHONE_REGEX): boolean;

export { export_default as validatePhone };
