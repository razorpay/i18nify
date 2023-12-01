import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { I18nState } from '../.internal/state/types';

/**
 * Function to set and override the active state in i18nify SDK
 *
 * ===== USAGE =====
 * import { setState } from "@razorpay/i18nify";
 * setState({locale: 'en-US'})
 *
 * @param newState data to set in i18nState instance
 */
const setState = (newState: Partial<I18nState>): void => {
  state.setState(newState);
};

export default withErrorBoundary<typeof setState>(setState);
