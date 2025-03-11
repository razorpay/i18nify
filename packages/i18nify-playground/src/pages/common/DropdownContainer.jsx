import {
  ActionList,
  ActionListItem,
  Box,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  Text,
  TextInput,
} from '@razorpay/blade/components';
import React from 'react';

const RenderContainer = ({ input, handleInputChange, intlOptions }) => {
  if (input.type === 'select') {
    return (
      <Box
        display="grid"
        alignItems="center"
        columnGap="spacing.4"
        gridTemplateColumns="1fr 3fr"
      >
        <Box>
          <Text>{input.label}</Text>
        </Box>
        <Box>
          <Dropdown selectionType="single" _width="100%">
            <SelectInput
              label=""
              value={intlOptions[input.key]}
              onChange={({ values }) => handleInputChange(input.key, values[0])}
            />
            <DropdownOverlay>
              <ActionList>
                {input.options.map((option) => (
                  <ActionListItem title={option} value={option} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      display="grid"
      alignItems="center"
      columnGap="spacing.4"
      gridTemplateColumns="1fr 3fr"
    >
      <Box>
        <Text>{input.label}</Text>
      </Box>
      <Box>
        <TextInput
          label=""
          type={input.type}
          value={intlOptions[input.key]}
          onChange={({ value }) => handleInputChange(input.key, value)}
        />
      </Box>
    </Box>
  );
};

export default RenderContainer;
