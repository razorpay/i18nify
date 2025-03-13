import React from 'react';
import { Box, TextInput } from '@razorpay/blade/components';
import CodeEditor from 'src/components/Generic/CodeEditor';
import { getCurrencyList } from '@razorpay/i18nify-js';
import IntlOptionsNumberForm from 'src/components/intlOptions/IntlOptionsNumberForm';
import GenericDropdown from 'src/components/Generic/GenericDropdown';
import { useMobile } from 'src/hooks/useMobile';

const NumberForm = ({
  inpValue,
  code,
  currency,
  onInpChange,
  onCurrencyChange,
  isSmallEditor = false,
  includeIntlOptions = true,
}) => {
  const isMobile = useMobile();

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        rowGap="spacing.5"
      >
        <Box padding="spacing.3" paddingLeft="spacing.0">
          <TextInput
            label="Enter value"
            value={inpValue}
            onChange={({ value }) => onInpChange(value)}
            size="medium"
            placeholder="Enter value..."
          />
        </Box>
        <Box
          width="100%"
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          columnGap="spacing.3"
          alignItems="center"
          marginBottom="spacing.3"
          rowGap={isMobile ? 'spacing.3' : 'spacing.0'}
        >
          <Box width="100%">
            <GenericDropdown
              label="Choose Currency"
              value={currency}
              list={Object.keys(getCurrencyList()).map((option) => ({
                title: option,
                value: option,
              }))}
              onChange={(val) => onCurrencyChange(val)}
            />
          </Box>
        </Box>
        {isSmallEditor && (
          <Box display="flex" justifyContent="start" alignItems="start">
            <CodeEditor isSmallEditor={isSmallEditor} code={code} />
          </Box>
        )}
      </Box>

      {!isSmallEditor && (
        <Box
          display="grid"
          gridTemplateColumns={isMobile ? '1fr' : '1fr 1fr'}
          rowGap={isMobile ? 'spacing.5' : '0'}
        >
          {includeIntlOptions && <IntlOptionsNumberForm />}
          <Box
            display="flex"
            justifyContent="start"
            alignItems="start"
            width="100%"
            padding="spacing.7"
          >
            <CodeEditor isSmallEditor={isSmallEditor} code={code} />
          </Box>
        </Box>
      )}

      {includeIntlOptions && isSmallEditor && <IntlOptionsNumberForm />}
    </>
  );
};

export default NumberForm;
