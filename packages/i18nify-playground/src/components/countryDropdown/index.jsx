import { Box, MenuItem, Select, Typography } from '@mui/material';
import { getAllCountries } from '@razorpay/i18nify-js';
import React, { useEffect, useState } from 'react';

const CountryDropdown = ({
  label = 'Select Country',
  value,
  onChange,
  list = [],
  selectStyle,
}) => {
  const [countryList, setCountryList] = useState(list);

  useEffect(() => {
    if (!list || !list.length) {
      getAllCountries().then((res) => {
        const countryList = Object.keys(res).map((code) => ({
          ...res[code],
          code,
        }));
        setCountryList(countryList);
      });
    }
  }, [list]);

  return (
    <>
      <Typography variant="h5">{label}</Typography>
      <Select
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          height: '57px',
          marginRight: 1,
          width: '100%',
          mb: 4,
          ...selectStyle,
        }}
      >
        {countryList.map((country) => (
          <MenuItem key={country.code} value={country.code}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'initial',
              }}
            >
              <div width="30px">
                {country.code} - {country.country_name}
              </div>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default CountryDropdown;
