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
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
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
        description={` 📞🔒 The getMaskedPhoneNumber function is a versatile tool designed
            to handle phone number formatting and masking based on the specific
            requirements of different countries. This function is ideal for
            applications that require the display of partially hidden phone
            numbers for security purposes or privacy concerns. It supports a
            wide range of configurations, including options to mask portions of
            the phone number, specify the number of digits to mask, and choose
            whether to mask digits from the beginning or end of the number.`}
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
