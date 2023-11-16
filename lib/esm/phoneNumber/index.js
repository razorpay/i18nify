var COUNTRY_PHONE_REGEX = {
    IN: /^[789]\d{9}$/,
};
function validatePhone (phone, country) {
    var regex = COUNTRY_PHONE_REGEX[country];
    return regex.test(phone);
}

export { validatePhone };
//# sourceMappingURL=index.js.map
