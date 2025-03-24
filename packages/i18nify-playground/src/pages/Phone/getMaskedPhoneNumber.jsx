import { useState } from 'react';

import {
  ActionList,
  ActionListItem,
  Box,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  TextInput,
} from '@razorpay/blade/components';
import React from 'react';
import CountryDropdown from 'src/components/Generic/CountryDropdown';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import { PHONE_MASKING_INPUTS } from 'src/constants/phoneNumber';
import { getMaskedPhoneNumber } from '@razorpay/i18nify-js/phoneNumber';
import PhoneMaskingOptions from 'src/components/intlOptions/PhoneMaskingOptions';
import { DEFAULT_PHONE_NUMBER } from 'src/pages/Phone/common/data/phoneNumber';
import { DEFAULT_COUNTRY_CODE } from 'src/components/Dashboard/constants/common';
import TextEditorForStrings from 'src/components/TextEditorForStrings/TextEditorForStrings';

const INITIAL_STATE = PHONE_MASKING_INPUTS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultValue || '';
  return acc;
}, {});

export default function GetMaskedPhoneNumber() {
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [inpValue, setInpValue] = useState(DEFAULT_PHONE_NUMBER);
  const [maskingOptions, setMaskingOptions] = useState(INITIAL_STATE);
  const [withDialCode, setWithDialCode] = useState('true');

  return (
    <Box>
      <LayoutHeader
        title="getMaskedPhoneNumber"
        description={`🔒 Your essential utility for masking sensitive phone numbers! 🌍 Features include phone number masking with locale support and customizable masking patterns. 🔄 Perfect for apps needing privacy-focused number display, the function masks digits according to configurable rules and country-specific formats. 💫 Includes support for various masking options like mask position, character count, and dial code handling. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent phone number masking across your application.`}
      />

      <Box
        display="flex"
        rowGap="spacing.3"
        flexDirection="column"
        flexWrap="wrap"
      >
        <TextInput
          value={inpValue}
          onChange={({ value }) => {
            setInpValue(value);
          }}
          label=""
          placeholder="Enter value..."
        />

        <CountryDropdown
          value={countryCode}
          onChange={(val) => setCountryCode(val)}
        />

        <Dropdown selectionType="single" _width="100%">
          <SelectInput
            label="With Dial Code?"
            value={withDialCode.toString()}
            onChange={({ values }) => setWithDialCode(values[0])}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title={`true`} value={`true`} />
              <ActionListItem title={`false`} value={`false`} />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <TextEditorForStrings
          value={getMaskedPhoneNumber({
            countryCode,
            phoneNumber: inpValue,
            withDialCode: withDialCode === 'true' ? true : false,
            maskingOptions: {
              ...maskingOptions,
              maskedDigitsCount: +maskingOptions?.maskedDigitsCount,
            },
          })}
        />
      </Box>

      <Box marginTop="spacing.7">
        <PhoneMaskingOptions
          maskingOptions={maskingOptions}
          onChange={(val) => setMaskingOptions(val)}
        />
      </Box>
    </Box>
  );
}
