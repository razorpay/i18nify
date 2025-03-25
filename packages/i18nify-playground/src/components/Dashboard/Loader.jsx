import { Box, Spinner } from '@razorpay/blade/components';
import React from 'react';

const Loader = () => {
  return (
    <Box
      width="100%"
      height="100%"
      backgroundColor="transparent"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="10"
      position="absolute"
      top="spacing.0"
      bottom="spacing.0"
      right="spacing.0"
      left="spacing.0"
    >
      <Spinner accessibilityLabel="loader" color="primary" />
    </Box>
  );
};

export default Loader;
