import { withErrorBoundary } from '../../common/errorBoundary';

const getCountryFlagAsSvg = async (countryCode: string) => {
  try {
    const countrySvg = await import(`./data/${countryCode}.svg`);
    return countrySvg;
  } catch (err) {
    throw new Error('Invalid country code!');
  }
};

export default withErrorBoundary<typeof getCountryFlagAsSvg>(
  getCountryFlagAsSvg,
);
