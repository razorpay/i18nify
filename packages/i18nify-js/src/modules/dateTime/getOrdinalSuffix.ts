import { withErrorBoundary } from '../../common/errorBoundary';

const getOrdinalSuffix = (n: number): string => {
  if (!Number.isInteger(n) || n < 1)
    throw new Error(
      `Parameter 'n' is invalid! Expected a positive integer, received: ${n}.`,
    );

  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return 'th';

  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export default withErrorBoundary<typeof getOrdinalSuffix>(getOrdinalSuffix);
