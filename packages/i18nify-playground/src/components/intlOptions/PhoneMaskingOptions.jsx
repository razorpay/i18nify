import { Box, Heading } from '@razorpay/blade/components';
import React from 'react';

import { PHONE_MASKING_INPUTS } from 'src/constants/phoneNumber';
import RenderContainer from 'src/pages/common/DropdownContainer';

const PhoneMaskingOptions = ({ maskingOptions, onChange }) => {
  const handleInputChange = (key, value) => {
    const newData = {
      ...maskingOptions,
      [key]: value,
    };
    onChange(newData);
  };

  const renderInput = (input) => {
    return (
      <RenderContainer
        input={input}
        handleInputChange={handleInputChange}
        intlOptions={maskingOptions}
      />
    );
  };

  return (
    <Box padding="spacing.4" paddingLeft="spacing.0">
      <Heading> Masking Options:</Heading>

      {PHONE_MASKING_INPUTS.map((input) => {
        return (
          <Box padding="spacing.3" paddingLeft="spacing.0" overflowY="auto">
            {renderInput(input)}
          </Box>
        );
      })}
    </Box>
  );
};

export default PhoneMaskingOptions;
