// Custom Error class to extend properties to error object
class I18nifyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'i18nify Error';
        this.timestamp = new Date();
        // more params like type of error/severity can be added in future for better debugging.
    }
}
/**
 * withErrorBoundary is a higher order function that takes function as parameter and wraps it in try/catch block.
 * It appends additional attributes and serves as a centralized error-handling service.
 * Usage =>
 * const wrappedUtilityFn = withErrorBoundary(utilityFn)
 *
 * @param fn utility that is wrapped in error boundary
 * @returns {Function} returns the function wrapped in try/catch block
 */
const withErrorBoundary = (fn) => {
    return function (...rest) {
        try {
            return fn.call(this, ...rest);
        }
        catch (err) {
            console.warn('[I18N Error]: ', err);
            // Currently, we are throwing the error as it is to consumers.
            // In the future, this can be modified as per our requirement, like an error logging service.
            throw new I18nifyError(err);
        }
    };
};

function getDefaultState() {
    return {
        locale: '',
        direction: '',
        country: '',
    };
}

class I18nStateManager {
    constructor() {
        this.state = getDefaultState();
    }
    static getInstance() {
        if (!I18nStateManager.instance) {
            I18nStateManager.instance = new I18nStateManager();
        }
        return I18nStateManager.instance;
    }
    static resetInstance() {
        I18nStateManager.instance = undefined;
    }
    getState() {
        return Object.assign({}, this.state);
    }
    setState(newState) {
        this.state = Object.assign(Object.assign({}, this.state), newState);
    }
    resetState() {
        this.state = getDefaultState();
    }
}
var state = I18nStateManager.getInstance();

/**
 * function to return active i18n state
 *
 *  ===== USAGE =====
 * import { getState } from '@razorpay/i18nify-js';
 *
 * console.log(getState())
 *
 * @returns i18n state
 */
const getState = () => {
    return state.getState();
};
var getState$1 = withErrorBoundary(getState);

/**
 * Function to set and override the active state in i18nify SDK
 *
 * ===== USAGE =====
 * import { setState } from "@razorpay/i18nify-js";
 * setState({locale: 'en-US'})
 *
 * @param newState data to set in i18nState instance
 */
const setState = (newState) => {
    state.setState(newState);
};
var setState$1 = withErrorBoundary(setState);

/**
 * Function to reset the active state in i18nify SDK
 *
 * ===== USAGE =====
 * import { resetState } from "@razorpay/i18nify-js";
 * resetState()
 *
 * @param newState data to set in i18nState instance
 */
const resetState = () => {
    state.resetState();
};
var resetState$1 = withErrorBoundary(resetState);

export { getState$1 as getState, resetState$1 as resetState, setState$1 as setState };
//# sourceMappingURL=index.js.map
