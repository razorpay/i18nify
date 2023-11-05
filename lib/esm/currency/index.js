function formatCurrency (currency, amount, options) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency }).format(amount);
}

function logger (label) {
    console.log("Hi I am logger service =", label);
}

export { formatCurrency, logger };
//# sourceMappingURL=index.js.map
