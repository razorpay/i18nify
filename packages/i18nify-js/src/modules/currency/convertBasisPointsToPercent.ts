import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Converts basis points to a percentage.
 *
 * One basis point equals one-hundredth of a percentage point (0.01%).
 * For example, 250 bps → 2.5 (i.e. 2.50%).
 *
 * @param {number} basisPoints - The value in basis points.
 * @returns {number} The equivalent percentage value.
 * @throws Will throw an error if the input is not a finite number.
 */
const convertBasisPointsToPercent = (basisPoints: number): number => {
  if (!Number.isFinite(basisPoints)) {
    throw new Error(
      `convertBasisPointsToPercent expects a finite number, received: ${basisPoints}`,
    );
  }
  return basisPoints / 100;
};

export default withErrorBoundary<typeof convertBasisPointsToPercent>(
  convertBasisPointsToPercent,
);
