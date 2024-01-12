import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { I18nState } from '../.internal/state/types';

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
const getState = (): I18nState => {
  return state.getState();
};

export default withErrorBoundary<typeof getState>(getState);
