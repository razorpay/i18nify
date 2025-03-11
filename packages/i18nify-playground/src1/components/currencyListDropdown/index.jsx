import React from 'react';
import { getCurrencyList } from '@razorpay/i18nify-js';

import { Select, MenuItem } from '@mui/material';

const index = ({ currency, onChange }) => {
  return (
    <Select
      fullWidth
      size="small"
      value={currency}
      onChange={(ev) => onChange(ev.target.value)}
    >
      {Object.keys(getCurrencyList()).map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default index;
