import {
  ActionList,
  ActionListItem,
  Box,
  Dropdown,
  DropdownOverlay,
  Heading,
  SelectInput,
  Text,
  TextInput,
  useToast,
} from '@razorpay/blade/components';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { getDialCodeCountryMap } from 'src/pages/Phone/network';
import {
  dialCodeMap,
  localPhoneNumbersByDialCodeMap,
} from './data/phoneNumber';
import { FLAG_4X3_BASE_PATH } from 'src/shared/constants';
import { useMobile } from 'src/hooks/useMobile';

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

  const toast = useToast();
  const isMobile = useMobile();

  const { data, isPending, mutate } = useMutation({
    mutationFn: getDialCodeCountryMap,
    onError: () => {
      toast.show({ content: 'Error', color: 'negative' });
    },
  });

  useEffect(() => {
    mutate();
  }, []);

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
                isDisabled={isPending}
                placeholder="Select"
                value={dialCode}
                onChange={({ values }) => onDialCodeChange(values[0])}
              />

              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="-" value="-" />
                  {Object.entries(dialCodeMap).map(([code]) => (
                    <ActionListItem
                      title={`+ ${code}`}
                      value={`+ ${code}`}
                      leading={
                        <img
                          src={`${FLAG_4X3_BASE_PATH}/${data?.dial_code_to_country?.[
                            code
                          ]?.[0]?.toLocaleLowerCase()}.svg`}
                        />
                      }
                    />
                  ))}
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
