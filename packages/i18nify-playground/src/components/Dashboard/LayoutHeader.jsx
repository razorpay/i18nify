import { Box, Text, Heading } from '@razorpay/blade/components';
import React from 'react';
import { useMobile } from 'src/hooks/useMobile';

const LayoutHeader = ({ title, description }) => {
  const isMobile = useMobile();

  return (
    <Box
      display="flex"
      rowGap="spacing.4"
      flexDirection="column"
      paddingTop="spacing.7"
      paddingBottom="spacing.7"
    >
      <Heading
        size={isMobile ? 'medium' : '2xlarge'}
        color="surface.text.primary.normal"
      >
        {title}
      </Heading>

      <Text>{description}</Text>
    </Box>
  );
};

export default LayoutHeader;
