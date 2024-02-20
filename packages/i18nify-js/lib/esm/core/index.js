import { w as withErrorBoundary } from '../index-0rEDS6JS.js';
import { s as state } from '../index-fuw8iepm.js';

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
