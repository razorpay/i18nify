import { Box, Text } from '@razorpay/blade/components';
import dayjs from 'dayjs';
import React from 'react';
import {
  GITHUB_LINK,
  NPM_LINK,
} from 'src/components/Dashboard/Footer/constants';
import { useMobile } from 'src/hooks/useMobile';

const Footer = () => {
  const navigateToExternal = (link) => {
    window.open(link, '_blank');
  };

  const isMobile = useMobile();

  return (
    <Box
      display="flex"
      width="100%"
      flexWrap="wrap"
      alignItems="center"
      rowGap={isMobile ? 'spacing.4' : 'spacing.0'}
      flexDirection={isMobile ? 'column' : 'row'}
      justifyContent="space-evenly"
      backgroundColor="surface.background.primary.subtle"
      padding="spacing.4"
    >
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Text weight="semibold">{`©${dayjs().format('YYYY')}`} Razorpay</Text>
      </Box>
      <Box display="flex" alignItems="center">
        <Text weight="semibold">Developed and designed by Razorpay</Text>
      </Box>

      <Box display="flex" alignItems="center" columnGap="spacing.3">
        <img
          onClick={() => navigateToExternal(GITHUB_LINK)}
          src="/assets/icons/ic_github.svg"
          style={{
            cursor: 'pointer',
          }}
        />
        <img
          onClick={() => {
            navigateToExternal(NPM_LINK);
          }}
          src="/assets/icons/ic_npm.svg"
          style={{
            height: 30,
            cursor: 'pointer',
          }}
        />
      </Box>
    </Box>
  );
};

export default Footer;
