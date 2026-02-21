import { Box, Text } from '@razorpay/blade/components';
import React from 'react';

const TextEditorForStrings = ({ value }) => {
  return (
    <Box
      padding="spacing.4"
      width="100%"
      backgroundColor="surface.background.primary.intense"
      borderRadius="medium"
    >
      <Text
        weight="semibold"
        size="medium"
        color="surface.text.staticWhite.normal"
      >
        {value}
      </Text>
    </Box>
  );
};

export default TextEditorForStrings;
