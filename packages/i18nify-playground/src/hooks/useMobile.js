import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

const defaultMobileBreakoints = ['base', 'xs', 's'];

export const useMobile = (mobileBreakoints = defaultMobileBreakoints) => {
  const { theme } = useTheme();
  const { matchedBreakpoint, matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });

  return (
    matchedDeviceType === 'mobile' ||
    (!!matchedBreakpoint && mobileBreakoints.includes(matchedBreakpoint))
  );
};
