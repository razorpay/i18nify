import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  Box,
  Dropdown,
  DropdownOverlay,
  Heading,
  SelectInput,
  Text,
  TextInput,
} from '@razorpay/blade/components';
import { getFlagOfCountry } from '@razorpay/i18nify-js/geo';
import React from 'react';
import { useMobile } from 'src/hooks/useMobile';
import {
  dialCodeCountryCodeMap,
  dialCodeMap,
  localPhoneNumbersByDialCodeMap,
} from './data/phoneNumber';

const PhoneNumberForm = ({
  inpValue,
  onInpChange,
  dialCode,
  onDialCodeChange,
  showDialCodeSelector = true,
  utilName,
  errorMessage = '',
  isValid = true,
}) => {
  const validatePhoneNumberUtilView = utilName === 'isValidPhoneNumber';
  const showHelperMessage = validatePhoneNumberUtilView && inpValue.length > 5;

  const isMobile = useMobile();

  return (
    <>
      <Box display="flex" flexDirection="column" rowGap="spacing.3">
        <Heading size="small">Please enter phone number</Heading>
        {showDialCodeSelector ? (
          <Text>
            One dial code can be applied to multiple regions ex: +1 shared by
            countries like the United States, Canada, Barbados, Bermuda
          </Text>
        ) : null}
      </Box>
      <Box marginTop="spacing.7">
        <Box
          display="flex"
          alignItems="flex-start"
          columnGap="spacing.3"
          flexWrap="wrap"
          rowGap={isMobile ? 'spacing.3' : 'spacing.0'}
        >
          {showDialCodeSelector ? (
            <Dropdown _width={isMobile ? '100%' : '150px'}>
              <SelectInput
                label=""
                placeholder="Select"
                value={dialCode}
                onChange={({ values }) => onDialCodeChange(values[0])}
              />

              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="-" value="-" key="default" />
                  {Object.entries(dialCodeMap).map(([code]) => {
                    return (
                      <ActionListItem
                        key={code}
                        title={`+ ${code}`}
                        value={`+ ${code}`}
                        leading={
                          <ActionListItemAsset
                            src={
                              getFlagOfCountry(
                                dialCodeCountryCodeMap?.[code]?.[0] ?? 'US',
                              )?.original
                            }
                            alt={`Flag of ${dialCodeCountryCodeMap?.[code]?.[0] ?? 'US'}`}
                          />
                        }
                      />
                    );
                  })}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          ) : null}
          <Box width={isMobile ? '100%' : 'fit-content'}>
            <TextInput
              value={inpValue}
              onChange={({ value }) => {
                onInpChange(value);
              }}
              label=""
              placeholder={
                localPhoneNumbersByDialCodeMap[dialCode?.replace('+', '')]
              }
              validationState={
                showHelperMessage && validatePhoneNumberUtilView
                  ? isValid
                    ? 'success'
                    : 'error'
                  : 'none'
              }
              successText="Valid phone number"
              errorText={errorMessage}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default PhoneNumberForm;
