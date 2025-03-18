import { Box, Heading } from '@razorpay/blade/components';
import React from 'react';

import { DATE_FORMAT_INTL_INPUTS } from 'src/constants/date';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';
import RenderContainer from 'src/pages/common/DropdownContainer';

const IntlOptionsDateForm = ({ utilName }) => {
  const { intlDateOptions, setIntlDateOptions } = useIntlOptionsDateContext();

  const handleInputChange = (key, value) => {
    setIntlDateOptions((prevState) => {
      const newData = {
        ...prevState,
        [key]: value,
      };
      return newData;
    });
  };

  const renderInput = (input) => {
    if (input.supportedUtilName.includes(utilName)) {
      return (
        <RenderContainer
          input={input}
          handleInputChange={handleInputChange}
          intlOptions={intlDateOptions}
        />
      );
    }
  };

  return (
    <Box padding="spacing.4" paddingLeft="spacing.0">
      <Heading>Intl Options:</Heading>

      {DATE_FORMAT_INTL_INPUTS.map((input) => {
        if (input.supportedUtilName.includes(utilName)) {
          return (
            <Box padding="spacing.3" paddingLeft="spacing.0" overflowY="auto">
              {renderInput(input)}
            </Box>
          );
        } else null;
      })}
    </Box>
  );
};

export default IntlOptionsDateForm;
