import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Converts a percentage to basis points.
 *
 * One basis point equals one-hundredth of a percentage point (0.01%).
 * For example, 2.5 (i.e. 2.50%) → 250 bps.
 *
 * @param {number} percent - The percentage value.
 * @returns {number} The equivalent value in basis points.
 * @throws Will throw an error if the input is not a finite number.
 */
const convertPercentToBasisPoints = (percent: number): number => {
  if (!Number.isFinite(percent)) {
    throw new Error(
      `convertPercentToBasisPoints expects a finite number, received: ${percent}`,
    );
  }
  return percent * 100;
};

export default withErrorBoundary<typeof convertPercentToBasisPoints>(
  convertPercentToBasisPoints,
);
