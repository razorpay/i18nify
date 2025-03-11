import { Box, Heading } from '@razorpay/blade/components';
import React from 'react';
import { NUMBER_FORMAT_INTL_INPUTS } from 'src/constants/number';
import { useIntlOptionsContext } from 'src/context/intlOptionsContext';
import RenderContainer from 'src/pages/common/DropdownContainer';

const IntlOptionsNumberForm = () => {
  const { intlOptions, setIntlOptions } = useIntlOptionsContext();

  const handleInputChange = (key, value) => {
    setIntlOptions((prevState) => {
      const newData = {
        ...prevState,
        [key]: value,
      };
      return newData;
    });
  };

  const renderInput = (input) => {
    return (
      <RenderContainer
        input={input}
        handleInputChange={handleInputChange}
        intlOptions={intlOptions}
      />
    );
  };

  return (
    <Box padding="spacing.4" paddingLeft="spacing.0">
      <Heading>Intl Options:</Heading>

      {NUMBER_FORMAT_INTL_INPUTS.map((input) => (
        <Box padding="spacing.3" paddingLeft="spacing.0" overflowY="auto">
          {renderInput(input)}
        </Box>
      ))}
    </Box>
  );
};

export default IntlOptionsNumberForm;
