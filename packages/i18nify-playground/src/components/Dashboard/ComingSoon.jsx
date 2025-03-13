import { Heading, Box } from '@razorpay/blade/components';
import React from 'react';

const ComingSoon = () => {
  return (
    <Box
      display="flex"
      flex={1}
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Heading size="large" color="surface.text.primary.normal">
        Coming soon...
      </Heading>
    </Box>
  );
};

export default ComingSoon;
