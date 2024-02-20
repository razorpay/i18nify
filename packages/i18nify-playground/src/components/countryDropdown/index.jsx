import { Box, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';

const CountryDropdown = ({ label = 'Select Country', value, onChange, list }) => {
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
        }}
      >
        {list.map((country) => (
          <MenuItem key={country.code} value={country.code}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'initial',
              }}
            >
              <div width="30px">
                {country.code} - {country.name}
              </div>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default CountryDropdown;
