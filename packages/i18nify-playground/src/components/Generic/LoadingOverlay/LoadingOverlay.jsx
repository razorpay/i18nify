import { Box, Fade, Spinner } from '@razorpay/blade/components';
import React from 'react';
import { Background } from 'src/components/Generic/LoadingOverlay/styled';

const LoadingOverlay = () => {
  return (
    <Fade>
      <Box width="100vw" height="100%">
        <Background>
          <Spinner accessibilityLabel="loader" color="primary" />
        </Background>
      </Box>
    </Fade>
  );
};

export default LoadingOverlay;
