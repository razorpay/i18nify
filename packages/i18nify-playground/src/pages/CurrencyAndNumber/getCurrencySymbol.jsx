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
        description={`💱 Your essential utility for retrieving currency symbols with precision! 🌍 Features include currency symbol lookup with locale support and validation. 🔄 Perfect for apps needing currency display, the function returns the correct symbol for any supported currency code. 💫 Includes built-in validation to ensure currency codes are valid and supported. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent currency symbol handling across your application.`}
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
