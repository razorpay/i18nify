import { useState } from 'react';
import { getCurrencyList, getCurrencySymbol } from '@razorpay/i18nify-js';
import React from 'react';
import { Box, Text } from '@razorpay/blade/components';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import GenericDropdown from 'src/components/Generic/GenericDropdown';

export default function GetCurrencySymbol() {
  const [currency, setCurrency] = useState('INR');
  return (
    <Box height="100%">
      <LayoutHeader
        title="getCurrencySymbol"
        description={`Picture this: it&apos;s like having a cool decoder ring for currency
            codes! 🔍💰 This little guy, grabs the symbol for a currency code
            from its secret stash.`}
      />

      <Box display="flex" alignItems="center" justifyContent="center">
        <Text>{getCurrencySymbol(currency)}</Text>
      </Box>
      <GenericDropdown
        label="Choose Currency"
        value={currency}
        list={Object.keys(getCurrencyList()).map((option) => ({
          title: option,
          value: option,
        }))}
        onChange={(val) => setCurrency(val)}
      />
    </Box>
  );
}
