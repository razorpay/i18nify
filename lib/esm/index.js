function formatCurrency (currency, amount, options) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency }).format(amount);
}

function logger (label) {
    console.log("Hi I am logger service =", label);
}

var COUNTRY_PHONE_REGEX = {
    IN: /^[789]\d{9}$/,
};
function validatePhone (phone, country) {
    var regex = COUNTRY_PHONE_REGEX[country];
    return regex.test(phone);
}

export { formatCurrency, logger, validatePhone };
//# sourceMappingURL=index.js.map
