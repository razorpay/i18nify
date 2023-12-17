import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';

/**
 * Function to reset the active state in i18nify SDK
 *
 * ===== USAGE =====
 * import { resetState } from "@razorpay/i18nify";
 * resetState()
 *
 * @param newState data to set in i18nState instance
 */
const resetState = (): void => {
  state.resetState();
};

export default withErrorBoundary<typeof resetState>(resetState);
