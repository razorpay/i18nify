import {
  ActionList,
  ActionListItem,
  Dropdown,
  DropdownOverlay,
  SelectInput,
} from '@razorpay/blade/components';
import React from 'react';
import PlaceholderMenuItem from 'src/components/Generic/PlaceholderMenuItem';

const GenericDropdown = ({
  label = '',
  value,
  onChange,
  list,
  isVirtualized = false,
}) => {
  return (
    <>
      <Dropdown>
        <SelectInput
          label={label}
          value={value}
          onChange={({ values }) => onChange(values[0])}
        />
        <DropdownOverlay>
          <ActionList isVirtualized={isVirtualized}>
            {list?.length === 0 ? (
              <PlaceholderMenuItem />
            ) : (
              list?.map((option) => (
                <ActionListItem title={option.title} value={option.value} />
              ))
            )}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </>
  );
};

export default GenericDropdown;
