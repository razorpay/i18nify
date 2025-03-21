import { Box, Text, Heading } from '@razorpay/blade/components';
import React from 'react';
import LocaleDropdown from 'src/components/LocalDropdown/LocaleDropdown';
import { useMobile } from 'src/hooks/useMobile';

const LayoutHeader = ({
  title,
  description,
  showLocalDropdown = false,
  supportedLocals = [],
}) => {
  const isMobile = useMobile();

  return (
    <Box
      display="flex"
      rowGap="spacing.4"
      flexDirection="column"
      paddingTop="spacing.7"
      paddingBottom="spacing.7"
    >
      <Box
        display="flex"
        width="100%"
        justifyContent={showLocalDropdown ? 'space-between' : 'start'}
      >
        <Heading
          size={isMobile ? 'medium' : '2xlarge'}
          color="surface.text.primary.normal"
        >
          {title}
        </Heading>
        {showLocalDropdown && (
          <LocaleDropdown supportedLocals={supportedLocals} />
        )}
      </Box>

      <Text>{description}</Text>
    </Box>
  );
};

export default LayoutHeader;
